import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";

const envFile = process.env.ENV_FILE || ".env";
dotenv.config({ path: envFile });

const { Pool } = pg;
const app = express();

const port = Number(process.env.PORT || 8787);
const aiProvider = String(process.env.AI_PROVIDER || "openai").toLowerCase();
const aiModel = process.env.AI_MODEL || process.env.OPENAI_MODEL || defaultModelByProvider(aiProvider);
const aiApiKey = String(process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "").trim();
const aiBaseURL = process.env.AI_BASE_URL || defaultBaseUrlByProvider(aiProvider);
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const corsOrigin = resolveCorsOrigin(process.env.ALLOWED_ORIGIN);

const pool = new Pool(buildDbConfig());

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "2mb" }));

try {
  await initDb();
} catch (error) {
  console.error("Falha ao conectar no PostgreSQL:", error.message);
  process.exit(1);
}

app.get("/", (_req, res) => {
  res.send("API online. Use /health.");
});

app.get("/health", async (_req, res) => {
  const dbNow = await pool.query("SELECT now() AS now").catch(() => null);
  res.json({
    ok: true,
    provider: aiProvider,
    model: aiModel,
    now: new Date().toISOString(),
    db: dbNow ? "connected" : "disconnected"
  });
});

app.post("/api/auth/register", (_req, res) => {
  return res.status(403).json({ error: "Cadastro desabilitado. Conta criada apenas pelo administrador." });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(401).json({ error: "Email ou senha incorreto" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = result.rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Email ou senha incorreto" });
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch {
    return res.status(500).json({ error: "Erro interno no login" });
  }
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1", [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    return res.json({ user });
  } catch {
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

app.put("/api/auth/profile", authRequired, async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!name || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  try {
    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1",
      [email, req.user.id]
    );
    if (exists.rows.length) {
      return res.status(409).json({ error: "Já existe uma conta com este email" });
    }

    if (password) {
      const hash = bcrypt.hashSync(password, 10);
      await pool.query(
        "UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4",
        [name, email, hash, req.user.id]
      );
    } else {
      await pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email, req.user.id]
      );
    }

    const userResult = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1", [req.user.id]);
    const user = userResult.rows[0];
    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    return res.json({ ok: true, user, token });
  } catch {
    return res.status(500).json({ error: "Não foi possível atualizar perfil" });
  }
});

app.get("/api/admin/users", authRequired, adminRequired, async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC");
    return res.json({
      users: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        createdAt: row.created_at
      }))
    });
  } catch {
    return res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

app.post("/api/admin/users", authRequired, adminRequired, async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const role = String(req.body?.role || "user").trim().toLowerCase();

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Permissão inválida" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (exists.rows.length) return res.status(409).json({ error: "Email já cadastrado" });

    const hash = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
      [name, email, hash, role]
    );

    const user = result.rows[0];
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch {
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.put("/api/admin/users/:id", authRequired, adminRequired, async (req, res) => {
  const userId = Number(req.params.id || 0);
  if (!userId) return res.status(400).json({ error: "Usuário inválido" });

  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const role = String(req.body?.role || "").trim().toLowerCase();

  try {
    const found = await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [userId]);
    if (!found.rows.length) return res.status(404).json({ error: "Usuário não encontrado" });

    const sets = [];
    const values = [];
    let idx = 1;

    if (name) {
      sets.push(`name = $${idx++}`);
      values.push(name);
    }

    if (email) {
      const exists = await pool.query("SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1", [email, userId]);
      if (exists.rows.length) return res.status(409).json({ error: "Email já cadastrado" });
      sets.push(`email = $${idx++}`);
      values.push(email);
    }

    if (password) {
      sets.push(`password_hash = $${idx++}`);
      values.push(bcrypt.hashSync(password, 10));
    }

    if (["admin", "user"].includes(role)) {
      sets.push(`role = $${idx++}`);
      values.push(role);
    }

    if (!sets.length) return res.json({ ok: true });

    values.push(userId);
    await pool.query(`UPDATE users SET ${sets.join(", ")} WHERE id = $${idx}`, values);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.delete("/api/admin/users/:id", authRequired, adminRequired, async (req, res) => {
  const userId = Number(req.params.id || 0);
  if (!userId) return res.status(400).json({ error: "Usuário inválido" });
  if (userId === req.user.id) return res.status(400).json({ error: "Não é permitido excluir seu próprio usuário" });

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

app.get("/api/state", authRequired, async (req, res) => {
  try {
    const row = await pool.query(
      "SELECT state_json, updated_at FROM app_states WHERE user_id = $1 LIMIT 1",
      [req.user.id]
    );

    if (!row.rows.length) return res.json({ state: null, updatedAt: null });

    return res.json({
      state: row.rows[0].state_json || null,
      updatedAt: row.rows[0].updated_at || null
    });
  } catch {
    return res.status(500).json({ error: "Erro ao carregar estado" });
  }
});

app.put("/api/state", authRequired, async (req, res) => {
  const state = req.body?.state;
  if (!state || typeof state !== "object") {
    return res.status(400).json({ error: "Campo 'state' inválido" });
  }

  try {
    await pool.query(
      `
      INSERT INTO app_states (user_id, state_json, updated_at)
      VALUES ($1, $2::jsonb, now())
      ON CONFLICT (user_id) DO UPDATE SET
        state_json = EXCLUDED.state_json,
        updated_at = now()
      `,
      [req.user.id, JSON.stringify(state)]
    );

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Erro ao salvar estado" });
  }
});

app.post("/api/jarvis", authRequired, async (req, res) => {
  const text = String(req.body?.text || "").trim();
  const date = String(req.body?.date || "").trim();

  if (!text) {
    return res.status(400).json({ error: "Campo 'text' é obrigatório" });
  }

  if (!aiApiKey) {
    return res.status(500).json({
      error: "AI_API_KEY não configurada",
      summary: "Servidor sem chave da IA.",
      actions: []
    });
  }

  try {
    const stateResult = await pool.query(
      "SELECT state_json FROM app_states WHERE user_id = $1 LIMIT 1",
      [req.user.id]
    );

    const state = stateResult.rows[0]?.state_json || {};
    const context = buildJarvisContext(state, date);
    const client = new OpenAI({ apiKey: aiApiKey, baseURL: aiBaseURL });

    const systemPrompt = `
Você é a assistente pessoal do usuário no app PulseBoard.
Converse de forma natural, clara e útil, em português do Brasil.
Pode responder com detalhes quando o usuário pedir explicações.

Regras de comportamento:
- Seja conversacional. Você NÃO precisa registrar ações em toda mensagem.
- Só gere actions quando houver pedido explícito de registro/alteração (ex.: "registre", "salve", "anote", "lance", "marque", "desmarque", "edite", "apague").
- Para kcal, água, sono e alimentação: se não houver pedido explícito para salvar no app, responda com orientação/cálculo e actions vazio.
- Se o usuário corrigir algo (ex.: "não treinei jiu"), gere ação de desfazer.
- Nunca invente valores/categorias que não foram citados.
- O campo summary pode ser uma resposta longa e detalhada quando fizer sentido.

Responda SOMENTE JSON válido neste formato:
{
  "summary": "resposta conversacional para o usuário",
  "actions": [
    {"type":"transaction","date":"YYYY-MM-DD","txType":"income|expense|investment","category":"string","amount":123.45,"note":"string"},
    {"type":"habit_done","name":"string","date":"YYYY-MM-DD"},
    {"type":"habit_undo","name":"string","date":"YYYY-MM-DD"},
    {"type":"kcal","value":2200,"date":"YYYY-MM-DD"},
    {"type":"health","sleep":8,"water":2.5,"date":"YYYY-MM-DD"}
  ]
}
Se não houver ação, retorne actions como array vazio.
`;

    const userPrompt = `
Data de referência: ${date || "hoje"}
Usuário: ${req.user.email}
Contexto do app (estado atual):
${JSON.stringify(context)}

Mensagem do usuário:
${text}
`;

    const outputText = await runAiRequest(client, systemPrompt, userPrompt);
    const parsed = parseJarvisOutput(outputText);

    return res.json({
      summary: String(parsed.summary || "Jarvis processou a mensagem."),
      actions: Array.isArray(parsed.actions) ? parsed.actions : []
    });
  } catch (error) {
    return res.status(500).json({
      error: formatAiError(error),
      summary: "Falha ao consultar o modelo de IA.",
      actions: []
    });
  }
});

function parseJarvisOutput(rawText) {
  const text = String(rawText || "").trim();

  try {
    const parsed = JSON.parse(text);
    return normalizeJarvisPayload(parsed, text);
  } catch {}

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    try {
      const parsed = JSON.parse(fenceMatch[1]);
      return normalizeJarvisPayload(parsed, text);
    } catch {}
  }

  const jsonCandidate = extractFirstJsonObject(text);
  if (jsonCandidate) {
    try {
      const parsed = JSON.parse(jsonCandidate);
      return normalizeJarvisPayload(parsed, text);
    } catch {}
  }

  return {
    summary: text || "Jarvis respondeu, mas em formato inesperado.",
    actions: []
  };
}

function normalizeJarvisPayload(parsed, fallbackText) {
  if (!parsed || typeof parsed !== "object") {
    return { summary: fallbackText || "Jarvis respondeu em formato inválido.", actions: [] };
  }

  return {
    summary: String(parsed.summary || fallbackText || "Jarvis processou a mensagem."),
    actions: Array.isArray(parsed.actions) ? parsed.actions : []
  };
}

function extractFirstJsonObject(text) {
  const src = String(text || "");
  const start = src.indexOf("{");
  if (start < 0) return "";

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < src.length; i++) {
    const ch = src[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }

  return "";
}

function defaultBaseUrlByProvider(provider) {
  if (provider === "deepseek") return "https://api.deepseek.com";
  if (provider === "gemini") return "https://generativelanguage.googleapis.com/v1beta/openai";
  if (provider === "mistral") return "https://api.mistral.ai/v1";
  return "https://api.openai.com/v1";
}

function defaultModelByProvider(provider) {
  if (provider === "deepseek") return "deepseek-chat";
  if (provider === "gemini") return "gemini-2.0-flash";
  if (provider === "mistral") return "mistral-small-latest";
  return "gpt-4o-mini";
}

async function runAiRequest(client, systemPrompt, userPrompt) {
  try {
    const response = await client.responses.create({
      model: aiModel,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1
    });

    const text = extractResponseText(response);
    if (text) return text;
  } catch (error) {
    const status = Number(error?.status || 0);
    const msg = String(error?.message || "").toLowerCase();
    const shouldFallback = status === 404 || status === 400 || msg.includes("responses") || msg.includes("not found") || aiProvider === "gemini";
    if (!shouldFallback) throw error;
  }

  const completion = await client.chat.completions.create({
    model: aiModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.1
  });

  return extractChatText(completion) || "{}";
}

function extractResponseText(response) {
  if (!response) return "";
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === "output_text" && typeof part?.text === "string") return part.text.trim();
      if (part?.type === "text" && typeof part?.text === "string") return part.text.trim();
    }
  }
  return "";
}

function extractChatText(completion) {
  const content = completion?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part?.type === "text" && typeof part?.text === "string") return part.text;
        return "";
      })
      .join("\n")
      .trim();
  }
  return "";
}

function formatAiError(error) {
  const status = Number(error?.status || 0);
  const msg = String(error?.message || "").toLowerCase();

  if (status === 429 || msg.includes("quota") || msg.includes("billing")) {
    return "Limite da IA atingido. Verifique plano e faturamento da API.";
  }
  if (status === 402 || msg.includes("insufficient") || msg.includes("balance")) {
    return "Crédito insuficiente na conta da IA.";
  }
  if (status === 401 || msg.includes("api key") || msg.includes("incorrect api key")) {
    return "Chave da IA inválida ou ausente.";
  }
  if (status === 404 || msg.includes("model")) {
    return "Modelo de IA não encontrado. Verifique AI_MODEL.";
  }
  if (status === 400 || msg.includes("status code (no body)")) {
    return "A IA recusou a requisição. Verifique modelo e permissões da chave (provider atual).";
  }
  return String(error?.message || "Erro interno");
}

function buildDbConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
    };
  }

  return {
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "pulseboard",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres"
  };
}

function resolveCorsOrigin(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value || value === "*") return true;

  const allowed = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!allowed.length) return true;
  if (allowed.length === 1) return allowed[0];

  return (origin, callback) => {
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error("CORS origin bloqueada"));
  };
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_role_check'
      ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'user'));
      END IF;
    END$$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_states (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const adminCount = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
  if ((adminCount.rows[0]?.count || 0) === 0) {
    await pool.query(`
      UPDATE users
      SET role = 'admin'
      WHERE id = (
        SELECT id FROM users ORDER BY created_at ASC LIMIT 1
      );
    `);
  }
}

function buildJarvisContext(state, referenceDate) {
  const safeState = state && typeof state === "object" ? state : {};
  const tasks = Array.isArray(safeState.tasks) ? safeState.tasks : [];
  const habits = Array.isArray(safeState.habits) ? safeState.habits : [];
  const transactions = Array.isArray(safeState.transactions) ? safeState.transactions : [];
  const healthLogs = safeState.healthLogs && typeof safeState.healthLogs === "object" ? safeState.healthLogs : {};
  const jarvisHistory = Array.isArray(safeState.jarvisHistory) ? safeState.jarvisHistory : [];

  const refDate = referenceDate || null;
  const monthKey = refDate ? refDate.slice(0, 7) : "";

  const habitStatusOnRefDate = habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    goal: Number(habit.goal || 0),
    doneOnReferenceDate: Boolean(habit?.logs?.[refDate || ""]),
    totalDoneInCurrentMonth: Object.keys(habit.logs || {}).filter((date) => monthKey && date.startsWith(monthKey)).length
  }));

  return {
    referenceDate: refDate,
    todayTasks: tasks.filter((task) => task?.date === refDate).slice(0, 60),
    recentTasks: tasks.slice(-120),
    habitStatusOnReferenceDate: habitStatusOnRefDate,
    recentTransactions: transactions.slice(-200),
    healthGoals: safeState.healthGoals || null,
    healthLogs,
    recentJarvisMessages: jarvisHistory.slice(-16).map((message) => ({
      role: message?.role === "user" ? "user" : "assistant",
      text: String(message?.text || message?.message || "").slice(0, 500)
    })),
    settings: safeState.settings ? { name: safeState.settings.name, email: safeState.settings.email } : null
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role || "user"
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function authRequired(req, res, next) {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = {
      id: Number(decoded.sub),
      name: String(decoded.name || ""),
      email: String(decoded.email || ""),
      role: String(decoded.role || "user")
    };
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function adminRequired(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Acesso permitido apenas para administradores" });
  }
  return next();
}

app.listen(port, () => {
  console.log(`Backend online em http://localhost:${port} (ENV_FILE=${envFile})`);
});
