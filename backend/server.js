import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const app = express();
const port = Number(process.env.PORT || 8787);
const aiProvider = String(process.env.AI_PROVIDER || "deepseek").toLowerCase();
const aiModel = process.env.AI_MODEL || process.env.OPENAI_MODEL || (aiProvider === "deepseek" ? "deepseek-chat" : "gpt-4.1-mini");
const aiApiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "";
const aiBaseURL = process.env.AI_BASE_URL || (aiProvider === "deepseek" ? "https://api.deepseek.com" : "https://api.openai.com/v1");
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

const pool = new Pool(buildDbConfig());

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));
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
      "SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = result.rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Email ou senha incorreto" });
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (_error) {
    return res.status(500).json({ error: "Erro interno no login" });
  }
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1 LIMIT 1", [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    return res.json({ user });
  } catch (_error) {
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

    const userResult = await pool.query("SELECT id, name, email FROM users WHERE id = $1 LIMIT 1", [req.user.id]);
    const user = userResult.rows[0];
    const token = signToken({ id: user.id, name: user.name, email: user.email });

    return res.json({ ok: true, user, token });
  } catch (_error) {
    return res.status(500).json({ error: "Não foi possível atualizar perfil" });
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
  } catch (_error) {
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
  } catch (_error) {
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
Você é o Jarvis do app PulseBoard.
Use o contexto atual do usuário para responder com precisão.

Retorne SOMENTE JSON válido no formato:
{
  "summary": "string curta",
  "actions": [
    {"type":"transaction","date":"YYYY-MM-DD","txType":"income|expense|investment","category":"string","amount":123.45,"note":"string"},
    {"type":"habit_done","name":"string"},
    {"type":"kcal","value":2200},
    {"type":"health","sleep":8,"water":2.5}
  ]
}
Se não houver ação, retorne actions vazio.
`;

    const userPrompt = `
Data de referência: ${date || "hoje"}
Usuário: ${req.user.email}
Contexto do app (estado atual):
${JSON.stringify(context)}

Mensagem do usuário:
${text}
`;

    const completion = await client.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1
    });

    const outputText = completion?.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      parsed = { summary: "Resposta da IA não veio em JSON puro.", actions: [] };
    }

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

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_states (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

function buildJarvisContext(state, referenceDate) {
  const safeState = state && typeof state === "object" ? state : {};
  const tasks = Array.isArray(safeState.tasks) ? safeState.tasks : [];
  const habits = Array.isArray(safeState.habits) ? safeState.habits : [];
  const transactions = Array.isArray(safeState.transactions) ? safeState.transactions : [];
  const healthLogs = safeState.healthLogs && typeof safeState.healthLogs === "object" ? safeState.healthLogs : {};

  return {
    referenceDate: referenceDate || null,
    todayTasks: tasks.filter((t) => t?.date === referenceDate).slice(0, 40),
    recentTasks: tasks.slice(-60),
    habits: habits.map((h) => ({ id: h.id, name: h.name, goal: h.goal, logsCount: Object.keys(h.logs || {}).length })),
    recentTransactions: transactions.slice(-80),
    healthGoals: safeState.healthGoals || null,
    healthLogs,
    settings: safeState.settings ? { name: safeState.settings.name, email: safeState.settings.email } : null
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), name: user.name, email: user.email },
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
      email: String(decoded.email || "")
    };
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

app.listen(port, () => {
  console.log(`Backend online em http://localhost:${port}`);
});

