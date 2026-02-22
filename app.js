
const STORAGE_KEY = "pulseboard_v4";
const SESSION_KEY = "pulseboard_session_v2";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "jarvis", label: "Jarvis" },
  { id: "habits", label: "Hábitos" },
  { id: "health", label: "Saúde" },
  { id: "finance", label: "Finanças" },
  { id: "journal", label: "Diário" },
  { id: "settings", label: "Configurações" }
];

const CATEGORY_BY_TYPE = {
  income: ["Salário", "Freelance", "Renda extra", "Reembolso", "Outros"],
  expense: ["Moradia", "Mercado", "Alimentação", "Transporte", "Saúde", "Educação", "Lazer", "Assinaturas", "Impostos", "Outros"],
  investment: ["Reserva", "Tesouro", "Ações", "ETF", "Crypto", "Outros"]
};

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const refs = {
  loginScreen: document.getElementById("loginScreen"),
  loginForm: document.getElementById("loginForm"),
  loginUser: document.getElementById("loginUser"),
  loginPass: document.getElementById("loginPass"),
  loginError: document.getElementById("loginError"),
  appShell: document.getElementById("appShell"),
  logoutBtn: document.getElementById("logoutBtn"),

  menu: document.getElementById("menu"),
  headerTitle: document.getElementById("headerTitle"),
  todayChip: document.getElementById("todayChip"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  views: document.querySelectorAll(".view"),

  dashMonthFilter: document.getElementById("dashMonthFilter"),
  dashPieChart: document.getElementById("dashPieChart"),
  dashTotalExpense: document.getElementById("dashTotalExpense"),
  dashTopCategory: document.getElementById("dashTopCategory"),
  dashPieLegend: document.getElementById("dashPieLegend"),
  dashTaskForm: document.getElementById("dashTaskForm"),
  dashTaskInput: document.getElementById("dashTaskInput"),
  dashTaskList: document.getElementById("dashTaskList"),
  dashTaskCounter: document.getElementById("dashTaskCounter"),

  jarvisForm: document.getElementById("jarvisForm"),
  jarvisInput: document.getElementById("jarvisInput"),
  jarvisHistory: document.getElementById("jarvisHistory"),

  habitTaskDateFilter: document.getElementById("habitTaskDateFilter"),
  habitTaskForm: document.getElementById("habitTaskForm"),
  habitTaskInput: document.getElementById("habitTaskInput"),
  habitTaskList: document.getElementById("habitTaskList"),
  habitCalendarPrev: document.getElementById("habitCalendarPrev"),
  habitCalendarNext: document.getElementById("habitCalendarNext"),
  habitCalendarLabel: document.getElementById("habitCalendarLabel"),
  habitForm: document.getElementById("habitForm"),
  habitName: document.getElementById("habitName"),
  habitGoal: document.getElementById("habitGoal"),
  habitGridHead: document.getElementById("habitGridHead"),
  habitGridBody: document.getElementById("habitGridBody"),
  habitLineChart: document.getElementById("habitLineChart"),

  healthPeriodFilter: document.getElementById("healthPeriodFilter"),
  healthChart: document.getElementById("healthChart"),
  healthGoalForm: document.getElementById("healthGoalForm"),
  goalKcal: document.getElementById("goalKcal"),
  goalSleep: document.getElementById("goalSleep"),
  goalWater: document.getElementById("goalWater"),
  healthForm: document.getElementById("healthForm"),
  healthDate: document.getElementById("healthDate"),
  healthKcal: document.getElementById("healthKcal"),
  healthSleep: document.getElementById("healthSleep"),
  healthWater: document.getElementById("healthWater"),
  healthIndicators: document.getElementById("healthIndicators"),

  finSubtabs: document.querySelectorAll(".subtab"),
  financeAnalytics: document.getElementById("financeAnalytics"),
  financeOps: document.getElementById("financeOps"),
  financePeriodType: document.getElementById("financePeriodType"),
  financeMonthFilter: document.getElementById("financeMonthFilter"),
  financeYearFilter: document.getElementById("financeYearFilter"),
  financeCustomStart: document.getElementById("financeCustomStart"),
  financeCustomEnd: document.getElementById("financeCustomEnd"),
  financePieChart: document.getElementById("financePieChart"),
  finTotalIncome: document.getElementById("finTotalIncome"),
  finTotalExpense: document.getElementById("finTotalExpense"),
  finTotalBalance: document.getElementById("finTotalBalance"),
  finTopCategory: document.getElementById("finTopCategory"),
  finPieLegend: document.getElementById("finPieLegend"),

  financeQuickSummary: document.getElementById("financeQuickSummary"),
  txForm: document.getElementById("txForm"),
  txDate: document.getElementById("txDate"),
  txType: document.getElementById("txType"),
  txCategory: document.getElementById("txCategory"),
  txAmount: document.getElementById("txAmount"),
  txNote: document.getElementById("txNote"),
  budgetForm: document.getElementById("budgetForm"),
  budgetArea: document.getElementById("budgetArea"),
  budgetPlanned: document.getElementById("budgetPlanned"),
  budgetTable: document.getElementById("budgetTable"),
  billForm: document.getElementById("billForm"),
  billName: document.getElementById("billName"),
  billCategory: document.getElementById("billCategory"),
  billAmount: document.getElementById("billAmount"),
  billDueDay: document.getElementById("billDueDay"),
  billTable: document.getElementById("billTable"),
  txFilterStart: document.getElementById("txFilterStart"),
  txFilterEnd: document.getElementById("txFilterEnd"),
  txFilterCategory: document.getElementById("txFilterCategory"),
  txFilterType: document.getElementById("txFilterType"),
  txTable: document.getElementById("txTable"),

  journalDateLabel: document.getElementById("journalDateLabel"),
  journalForm: document.getElementById("journalForm"),
  journalDateInput: document.getElementById("journalDateInput"),
  journalText: document.getElementById("journalText"),
  journalEntriesList: document.getElementById("journalEntriesList"),

  settingsForm: document.getElementById("settingsForm"),
  settingsName: document.getElementById("settingsName"),
  settingsEmail: document.getElementById("settingsEmail"),
  settingsPassword: document.getElementById("settingsPassword"),
  settingsTheme: document.getElementById("settingsTheme"),
  deleteAccountBtn: document.getElementById("deleteAccountBtn"),
  settingsMessage: document.getElementById("settingsMessage")
};

const chartInstances = {};
const now = new Date();
const todayKey = isoDate(now);
const currentMonthKey = todayKey.slice(0, 7);

const state = loadState();
let authToken = "";
let apiBase = "http://localhost:8787";
let saveTimer;
bootstrap();

async function bootstrap() {
  refs.todayChip.textContent = formatDate(todayKey);
  refs.healthDate.value = todayKey;
  refs.txDate.value = todayKey;
  refs.habitTaskDateFilter.value = state.ui.habitTaskDate || todayKey;
  refs.habitCalendarLabel.textContent = formatDate(refs.habitTaskDateFilter.value);
  refs.financeMonthFilter.value = state.ui.financeMonthFilter || currentMonthKey;
  refs.financeYearFilter.value = String(new Date().getFullYear());
  state.ui.journalDate = state.ui.journalDate || todayKey;
  refs.journalDateInput.value = state.ui.journalDate;
  refs.journalDateLabel.textContent = formatDate(state.ui.journalDate);
  refs.settingsName.value = state.settings.name;
  refs.settingsEmail.value = state.settings.email;
  refs.settingsPassword.value = state.settings.password;
  refs.settingsTheme.value = state.settings.theme;
  refs.goalKcal.value = state.healthGoals.kcal || "";
  refs.goalSleep.value = state.healthGoals.sleep || "";
  refs.goalWater.value = state.healthGoals.water || "";
  refs.journalText.value = state.journal[state.ui.journalDate] || "";

  buildMenu();
  bindEvents();
  applyTheme(state.settings.theme);
  hydrateCategorySelects();
  hydrateMonthFilters();

  const session = loadSession();
  if (session?.token) {
    authToken = session.token;
    try {
      const me = await apiRequest("/api/auth/me");
      if (me?.user) {
        await pullRemoteState();
        applyLoggedUser(me.user);
        showApp();
      } else {
        showLogin();
      }
    } catch {
      showLogin();
    }
  } else {
    showLogin();
  }

  renderAll();
}

function bindEvents() {
  refs.loginForm.addEventListener("submit", onLoginSubmit);
  refs.logoutBtn.addEventListener("click", onLogout);
  refs.themeToggleBtn.addEventListener("click", onThemeToggle);

  refs.dashMonthFilter.addEventListener("change", () => {
    state.ui.dashboardMonth = refs.dashMonthFilter.value;
    persistAndRender();
  });

  refs.dashTaskForm.addEventListener("submit", onTaskAddToday);
  refs.dashTaskList.addEventListener("click", onTaskActionClick);
  refs.habitTaskList.addEventListener("click", onTaskActionClick);

  refs.jarvisForm.addEventListener("submit", onJarvisSubmit);

  refs.habitTaskDateFilter.addEventListener("change", () => {
    state.ui.habitTaskDate = refs.habitTaskDateFilter.value || todayKey;
    persistAndRender();
  });
  refs.habitCalendarPrev.addEventListener("click", () => shiftHabitDate(-1));
  refs.habitCalendarNext.addEventListener("click", () => shiftHabitDate(1));
  refs.habitTaskForm.addEventListener("submit", onTaskAddByDate);
  refs.habitForm.addEventListener("submit", onHabitSubmit);
  refs.habitGridBody.addEventListener("change", onHabitGridChange);
  refs.habitGridBody.addEventListener("click", onHabitGridClick);

  refs.healthPeriodFilter.addEventListener("change", () => {
    state.ui.healthPeriod = refs.healthPeriodFilter.value;
    persistAndRender();
  });
  refs.healthGoalForm.addEventListener("submit", onHealthGoalSubmit);
  refs.healthForm.addEventListener("submit", onHealthLogSubmit);

  refs.finSubtabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.ui.financeView = btn.dataset.finView;
      persistAndRender();
    });
  });

  [refs.financePeriodType, refs.financeMonthFilter, refs.financeYearFilter, refs.financeCustomStart, refs.financeCustomEnd].forEach((el) => {
    el.addEventListener("change", () => {
      state.ui.financePeriodType = refs.financePeriodType.value;
      state.ui.financeMonthFilter = refs.financeMonthFilter.value;
      state.ui.financeYearFilter = refs.financeYearFilter.value;
      state.ui.financeCustomStart = refs.financeCustomStart.value;
      state.ui.financeCustomEnd = refs.financeCustomEnd.value;
      persistAndRender();
    });
  });

  refs.txType.addEventListener("change", hydrateCategorySelects);
  refs.txForm.addEventListener("submit", onTxSubmit);
  refs.budgetForm.addEventListener("submit", onBudgetSubmit);
  refs.billForm.addEventListener("submit", onBillSubmit);
  refs.budgetTable.addEventListener("click", onBudgetActionClick);
  refs.billTable.addEventListener("click", onBillActionClick);
  refs.txTable.addEventListener("click", onTxActionClick);
  [refs.txFilterStart, refs.txFilterEnd, refs.txFilterCategory, refs.txFilterType].forEach((el) => {
    el.addEventListener("change", renderFinanceOps);
    el.addEventListener("input", renderFinanceOps);
  });

  refs.journalDateInput.addEventListener("change", () => {
    state.ui.journalDate = refs.journalDateInput.value || todayKey;
    renderJournal();
  });

  refs.journalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateKey = state.ui.journalDate || todayKey;
    state.journal[dateKey] = refs.journalText.value.trim();
    persistAndRender();
  });

  refs.settingsForm.addEventListener("submit", onSettingsSubmit);

  refs.settingsTheme.addEventListener("change", () => applyTheme(refs.settingsTheme.value));
  refs.deleteAccountBtn.addEventListener("click", onDeleteAccount);
}

async function onLoginSubmit(event) {
  event.preventDefault();
  const email = refs.loginUser.value.trim();
  const password = refs.loginPass.value;

  if (!email || !password) {
    refs.loginError.textContent = "Email ou senha incorreto";
    return;
  }

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }, false);

    if (!data?.token) {
      refs.loginError.textContent = "Email ou senha incorreto";
      return;
    }

    authToken = data.token;
    saveSession({ token: data.token, user: data.user || null });
    refs.loginError.textContent = "";
    await pullRemoteState();
    applyLoggedUser(data.user || null);
    refs.loginForm.reset();
    showApp();
    renderAll();
  } catch (_error) {
    refs.loginError.textContent = "Email ou senha incorreto";
  }
}

function onLogout() {
  localStorage.removeItem(SESSION_KEY);
  authToken = "";
  if (refs.settingsMessage) refs.settingsMessage.textContent = "";
  showLogin();
}

function applyLoggedUser(user) {
  if (!user) return;
  state.settings.name = String(user.name || state.settings.name || "");
  state.settings.email = String(user.email || state.settings.email || "");

  refs.settingsName.value = state.settings.name;
  refs.settingsEmail.value = state.settings.email;
}

async function onSettingsSubmit(event) {
  event.preventDefault();
  if (!authToken) return;

  const name = refs.settingsName.value.trim();
  const email = refs.settingsEmail.value.trim().toLowerCase();
  const password = refs.settingsPassword.value;

  if (!name || !email) {
    if (refs.settingsMessage) refs.settingsMessage.textContent = "Preencha nome e email.";
    return;
  }

  try {
    const result = await apiRequest("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email, password })
    });

    applyLoggedUser(result?.user || { name, email });
    state.settings.theme = refs.settingsTheme.value;
    applyTheme(state.settings.theme);
    refs.settingsPassword.value = "";
    if (result?.token) {
      authToken = result.token;
      saveSession({ token: result.token, user: result.user || { name, email } });
    }
    if (refs.settingsMessage) refs.settingsMessage.textContent = "Configurações salvas.";
    persist();
  } catch (error) {
    if (refs.settingsMessage) refs.settingsMessage.textContent = error?.message || "Não foi possível salvar configurações.";
  }
}

function showLogin() {
  refs.loginScreen.classList.remove("hidden");
  refs.appShell.classList.add("hidden");
}

function showApp() {
  refs.loginScreen.classList.add("hidden");
  refs.appShell.classList.remove("hidden");
}

function onThemeToggle() {
  state.settings.theme = state.settings.theme === "light" ? "dark" : "light";
  refs.settingsTheme.value = state.settings.theme;
  applyTheme(state.settings.theme);
  persist();
}

function buildMenu() {
  refs.menu.innerHTML = MENU_ITEMS.map((item) => `<button class="menu-btn ${item.id === state.ui.activeView ? "active" : ""}" data-view="${item.id}" type="button">${item.label}</button>`).join("");
  refs.menu.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.ui.activeView = btn.dataset.view;
      persistAndRender();
    });
  });
}

function renderAll() {
  renderActiveView();
  renderDashboard();
  renderJarvis();
  renderHabits();
  renderHealth();
  renderFinance();
  renderJournal();
}

function renderActiveView() {
  refs.views.forEach((view) => view.classList.remove("active"));
  document.getElementById(`view-${state.ui.activeView}`)?.classList.add("active");
  refs.menu.querySelectorAll(".menu-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.view === state.ui.activeView));
  refs.headerTitle.textContent = MENU_ITEMS.find((i) => i.id === state.ui.activeView)?.label || "Dashboard";
}

function hydrateMonthFilters() {
  const months = gatherMonthKeys();
  refs.dashMonthFilter.innerHTML = months.map((m) => `<option value="${m}">${labelMonth(m)}</option>`).join("");
  refs.dashMonthFilter.value = months.includes(state.ui.dashboardMonth) ? state.ui.dashboardMonth : currentMonthKey;
  state.ui.dashboardMonth = refs.dashMonthFilter.value;
}

function gatherMonthKeys() {
  const set = new Set([currentMonthKey]);
  state.transactions.forEach((tx) => set.add(tx.date.slice(0, 7)));
  Object.keys(state.healthLogs).forEach((d) => set.add(d.slice(0, 7)));
  state.tasks.forEach((t) => set.add(t.date.slice(0, 7)));
  state.habits.forEach((h) => Object.keys(h.logs).forEach((d) => set.add(d.slice(0, 7))));
  return [...set].sort((a, b) => b.localeCompare(a));
}
function renderDashboard() {
  renderPieByMonth(refs.dashPieChart, "dashPie", state.ui.dashboardMonth, refs.dashTotalExpense, refs.dashTopCategory, refs.dashPieLegend);
  renderTaskLists();
}

function onTaskAddToday(event) {
  event.preventDefault();
  const title = refs.dashTaskInput.value.trim();
  if (!title) return;
  state.tasks.push({ id: crypto.randomUUID(), title, date: todayKey, done: false });
  refs.dashTaskForm.reset();
  persistAndRender();
}

function onTaskAddByDate(event) {
  event.preventDefault();
  const title = refs.habitTaskInput.value.trim();
  const date = state.ui.habitTaskDate || todayKey;
  if (!title) return;
  state.tasks.push({ id: crypto.randomUUID(), title, date, done: false });
  refs.habitTaskForm.reset();
  persistAndRender();
}

function renderTaskLists() {
  const todayTasks = state.tasks.filter((task) => task.date === todayKey);
  refs.dashTaskCounter.textContent = `${todayTasks.filter((t) => t.done).length}/${todayTasks.length} concluídas`;
  refs.dashTaskList.innerHTML = todayTasks.length ? todayTasks.map(taskItemHtml).join("") : "<p class='muted'>Sem tarefas hoje.</p>";

  const date = state.ui.habitTaskDate || todayKey;
  refs.habitTaskDateFilter.value = date;
  refs.habitCalendarLabel.textContent = formatDate(date);
  const habitTasks = state.tasks.filter((task) => task.date === date);
  refs.habitTaskList.innerHTML = habitTasks.length ? habitTasks.map(taskItemHtml).join("") : "<p class='muted'>Sem tarefas nesta data.</p>";
}

function taskItemHtml(task) {
  return `
    <div class="list-item ${task.done ? "done" : ""}">
      <div>
        <strong>${escapeHtml(task.title)}</strong>
        <p class="muted">${formatDate(task.date)}</p>
      </div>
      <div class="item-actions">
        <button class="btn ghost" type="button" data-task-action="toggle" data-task-id="${task.id}">${task.done ? "Desfazer" : "Concluir"}</button>
        <button class="btn ghost" type="button" data-task-action="edit" data-task-id="${task.id}">Editar</button>
        <button class="btn danger" type="button" data-task-action="delete" data-task-id="${task.id}">Excluir</button>
      </div>
    </div>
  `;
}

function onTaskActionClick(event) {
  const button = event.target.closest("button[data-task-action]");
  if (!button) return;
  const task = state.tasks.find((item) => item.id === button.dataset.taskId);
  if (!task) return;
  if (button.dataset.taskAction === "toggle") task.done = !task.done;
  if (button.dataset.taskAction === "edit") {
    const next = prompt("Editar tarefa:", task.title);
    if (next === null || !next.trim()) return;
    task.title = next.trim();
  }
  if (button.dataset.taskAction === "delete") state.tasks = state.tasks.filter((t) => t.id !== task.id);
  persistAndRender();
}

function shiftHabitDate(delta) {
  const date = new Date(`${state.ui.habitTaskDate || todayKey}T00:00:00`);
  date.setDate(date.getDate() + delta);
  state.ui.habitTaskDate = isoDate(date);
  persistAndRender();
}

function renderJarvis() {
  const history = Array.isArray(state.jarvisHistory) ? state.jarvisHistory : [];
  refs.jarvisHistory.innerHTML = history.length
    ? history.map((item) => {
      const role = item.role === "user" ? "user" : "assistant";
      const text = item.text || item.message || "";
      const when = item.createdAt
        ? '<span class="chat-time">' + formatDateTime(item.createdAt) + '</span>'
        : '';
      return '<div class="chat-msg ' + role + '"><p>' + escapeHtml(text) + '</p>' + when + '</div>';
    }).join("")
    : "<p class='muted'>Sem mensagens ainda.</p>";

  refs.jarvisHistory.scrollTop = refs.jarvisHistory.scrollHeight;
}

async function onJarvisSubmit(event) {
  event.preventDefault();
  const text = refs.jarvisInput.value.trim();
  if (!text || !authToken) return;

  state.jarvisHistory.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    role: "user",
    text
  });

  try {
    const result = await apiRequest("/api/jarvis", {
      method: "POST",
      body: JSON.stringify({ text, date: todayKey })
    });

    const actions = applyJarvisActions(Array.isArray(result?.actions) ? result.actions : []);
    const summary = String(result?.summary || "Jarvis processou sua mensagem.");
    const responseText = actions.length ? summary + "\n" + actions.join(" | ") : summary;

    state.jarvisHistory.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      role: "assistant",
      text: responseText,
      status: "success"
    });
  } catch (error) {
    state.jarvisHistory.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      role: "assistant",
      text: formatJarvisError(error),
      status: "error"
    });
  }

  refs.jarvisInput.value = "";
  persistAndRender();
}

function formatJarvisError(error) {
  const msg = String(error?.message || "");
  const lower = msg.toLowerCase();
  if (lower.includes("429") || lower.includes("quota") || lower.includes("billing")) {
    return "Seu limite da IA foi atingido. Verifique plano e faturamento da API.";
  }
  if (lower.includes("401") || lower.includes("api key") || lower.includes("incorrect api key")) {
    return "Chave da IA inválida ou ausente no backend.";
  }
  if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return "Não foi possível conectar ao backend Jarvis (http://localhost:8787).";
  }
  return msg || "Falha ao chamar Jarvis remoto.";
}

function applyJarvisActions(actions) {
  const applied = [];
  actions.forEach((action) => {
    if (action?.type === "transaction") {
      const txType = ["income", "expense", "investment"].includes(action.txType) ? action.txType : "expense";
      const amount = Number(action.amount || 0);
      if (amount > 0) {
        state.transactions.push({
          id: crypto.randomUUID(),
          date: String(action.date || todayKey),
          type: txType,
          category: String(action.category || "Outros"),
          amount,
          note: String(action.note || "Jarvis")
        });
        applied.push(`Transação ${txType}: ${formatCurrency(amount)}`);
      }
      return;
    }

    if (action?.type === "habit_done") {
      markHabitToday(String(action.name || "Hábito"));
      applied.push(`Hábito marcado: ${String(action.name || "Hábito")}`);
      return;
    }

    if (action?.type === "kcal") {
      if (!state.healthLogs[todayKey]) state.healthLogs[todayKey] = { kcal: 0, sleep: 0, water: 0 };
      state.healthLogs[todayKey].kcal = Number(action.value || 0);
      applied.push(`Kcal: ${state.healthLogs[todayKey].kcal}`);
      return;
    }

    if (action?.type === "health") {
      if (!state.healthLogs[todayKey]) state.healthLogs[todayKey] = { kcal: 0, sleep: 0, water: 0 };
      if (Number(action.sleep || 0) > 0) state.healthLogs[todayKey].sleep = Number(action.sleep);
      if (Number(action.water || 0) > 0) state.healthLogs[todayKey].water = Number(action.water);
      applied.push("Saúde atualizada");
    }
  });
  return applied;
}
function renderHabits() {
  renderTaskLists();
  renderHabitGrid();
  renderHabitChart();
}

function onHabitSubmit(event) {
  event.preventDefault();
  const name = refs.habitName.value.trim();
  const goal = Number(refs.habitGoal.value);
  if (!name || goal < 1) return;
  state.habits.push({ id: crypto.randomUUID(), name, goal, logs: {} });
  refs.habitForm.reset();
  refs.habitGoal.value = "20";
  persistAndRender();
}

function renderHabitGrid() {
  const days = daysOfMonth(currentMonthKey);
  const headCells = ["<th class='habit-name'>Hábito</th>", "<th class='goal-col'>Meta</th>"];
  days.forEach((d) => headCells.push(`<th class='check-col'>${Number(d.slice(-2))}</th>`));
  headCells.push("<th>Execução</th>");
  headCells.push("<th class='progress-col'>Progresso</th>");
  headCells.push("<th>Ações</th>");
  refs.habitGridHead.innerHTML = `<tr>${headCells.join("")}</tr>`;

  refs.habitGridBody.innerHTML = state.habits.map((habit) => {
    const done = completedInMonthForHabit(habit, currentMonthKey);
    const ratio = habit.goal ? clamp((done / habit.goal) * 100, 0, 100) : 0;
    const cells = [`<td class='habit-name'>${escapeHtml(habit.name)}</td>`, `<td>${habit.goal}</td>`];
    days.forEach((date) => {
      cells.push(`<td><input type='checkbox' data-habit-id='${habit.id}' data-date='${date}' ${habit.logs[date] ? "checked" : ""}></td>`);
    });
    cells.push(`<td><strong>${done}/${habit.goal}</strong></td>`);
    cells.push(`<td><div class='progress'><div style='width:${ratio}%'></div></div></td>`);
    cells.push(`<td><button class='btn ghost' type='button' data-habit-edit='${habit.id}'>Editar</button> <button class='btn danger' type='button' data-habit-delete='${habit.id}'>Excluir</button></td>`);
    return `<tr>${cells.join("")}</tr>`;
  }).join("");
}

function onHabitGridChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") return;
  const habit = state.habits.find((h) => h.id === target.dataset.habitId);
  if (!habit) return;
  if (target.checked) habit.logs[target.dataset.date] = true;
  else delete habit.logs[target.dataset.date];
  persistAndRender();
}

function onHabitGridClick(event) {
  const editBtn = event.target.closest("button[data-habit-edit]");
  const deleteBtn = event.target.closest("button[data-habit-delete]");

  if (editBtn) {
    const habit = state.habits.find((h) => h.id === editBtn.dataset.habitEdit);
    if (!habit) return;
    const name = prompt("Nome do hábito:", habit.name);
    if (name === null) return;
    const goalRaw = prompt("Meta mensal (dias):", String(habit.goal));
    if (goalRaw === null) return;
    const goal = Number(goalRaw);
    if (!name.trim() || goal < 1) return;
    habit.name = name.trim();
    habit.goal = goal;
    persistAndRender();
    return;
  }

  if (deleteBtn) {
    state.habits = state.habits.filter((h) => h.id !== deleteBtn.dataset.habitDelete);
    persistAndRender();
  }
}

function renderHabitChart() {
  const dates = daysOfMonth(currentMonthKey);
  const labels = dates.map((d) => d.slice(-2));
  const values = dates.map((date) => state.habits.filter((h) => h.logs[date]).length);
  drawOrUpdateChart("habitLine", refs.habitLineChart, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Hábitos concluídos no dia",
        data: values,
        borderColor: "#3d556b",
        backgroundColor: "rgba(61,85,107,0.15)",
        fill: true,
        tension: 0.25
      }]
    },
    options: baseLineOptions(false, 0, Math.max(state.habits.length, 5))
  });
}
function renderHealth() {
  refs.healthPeriodFilter.value = state.ui.healthPeriod;
  refs.goalKcal.value = state.healthGoals.kcal || "";
  refs.goalSleep.value = state.healthGoals.sleep || "";
  refs.goalWater.value = state.healthGoals.water || "";
  renderHealthChart();
  renderHealthIndicators();
}

function onHealthGoalSubmit(event) {
  event.preventDefault();
  state.healthGoals.kcal = Number(refs.goalKcal.value) || 0;
  state.healthGoals.sleep = Number(refs.goalSleep.value) || 0;
  state.healthGoals.water = Number(refs.goalWater.value) || 0;
  persistAndRender();
}

function onHealthLogSubmit(event) {
  event.preventDefault();
  const date = refs.healthDate.value;
  if (!date) return;
  state.healthLogs[date] = {
    kcal: Number(refs.healthKcal.value) || 0,
    sleep: Number(refs.healthSleep.value) || 0,
    water: Number(refs.healthWater.value) || 0
  };
  persistAndRender();
}

function renderHealthChart() {
  const series = healthSeriesByPeriod(state.ui.healthPeriod);
  const goals = state.healthGoals;
  drawOrUpdateChart("health", refs.healthChart, {
    type: "line",
    data: {
      labels: series.labels,
      datasets: [
        { label: "Kcal", data: series.kcal, borderColor: "#d96868", yAxisID: "y", fill: false },
        { label: "Meta Kcal", data: series.kcal.map(() => goals.kcal || null), borderColor: "#d96868", borderDash: [5, 5], yAxisID: "y", fill: false },
        { label: "Sono", data: series.sleep, borderColor: "#4d89d8", yAxisID: "y1", fill: false },
        { label: "Meta Sono", data: series.sleep.map(() => goals.sleep || null), borderColor: "#4d89d8", borderDash: [5, 5], yAxisID: "y1", fill: false },
        { label: "Água", data: series.water, borderColor: "#3aa67d", yAxisID: "y1", fill: false },
        { label: "Meta Água", data: series.water.map(() => goals.water || null), borderColor: "#3aa67d", borderDash: [5, 5], yAxisID: "y1", fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { position: "left", min: 0, grid: { color: "rgba(125,136,153,0.2)" } },
        y1: { position: "right", min: 0, max: Math.max(12, goals.sleep + 2 || 10, goals.water + 2 || 8), grid: { drawOnChartArea: false } },
        x: { grid: { color: "rgba(125,136,153,0.15)" } }
      }
    }
  });
}

function healthSeriesByPeriod(period) {
  let dates;
  if (period === "month") {
    dates = daysOfMonth(currentMonthKey);
  } else {
    const count = Number(period);
    dates = Array.from({ length: count }, (_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (count - idx - 1));
      return isoDate(d);
    });
  }

  return {
    labels: dates.map(formatDateShort),
    kcal: dates.map((d) => Number(state.healthLogs[d]?.kcal || 0)),
    sleep: dates.map((d) => Number(state.healthLogs[d]?.sleep || 0)),
    water: dates.map((d) => Number(state.healthLogs[d]?.water || 0))
  };
}

function renderHealthIndicators() {
  const week = healthSeriesByPeriod("7");
  const current = healthSeriesByPeriod(state.ui.healthPeriod);
  const disciplined = mostDisciplinedDay();
  refs.healthIndicators.innerHTML = `
    <div class="list-item"><span>Média semanal de sono</span><strong>${average(week.sleep).toFixed(1)} h</strong></div>
    <div class="list-item"><span>Média kcal</span><strong>${Math.round(average(current.kcal))} kcal</strong></div>
    <div class="list-item"><span>Média água</span><strong>${average(current.water).toFixed(1)} L</strong></div>
    <div class="list-item"><span>Dia mais disciplinado</span><strong>${disciplined}</strong></div>
  `;
}

function mostDisciplinedDay() {
  const entries = Object.entries(state.healthLogs);
  if (!entries.length) return "Sem dados";
  let best = { date: "", score: -1 };
  entries.forEach(([date, log]) => {
    const sleepScore = scoreByGoal(Number(log.sleep || 0), Number(state.healthGoals.sleep || 8));
    const waterScore = scoreByGoal(Number(log.water || 0), Number(state.healthGoals.water || 2.5));
    const kcalGoal = Number(state.healthGoals.kcal || 2000);
    const kcalScore = clamp(100 - Math.abs(kcalGoal - Number(log.kcal || 0)) / 20, 0, 100);
    const total = (sleepScore + waterScore + kcalScore) / 3;
    if (total > best.score) best = { date, score: total };
  });
  return `${formatDate(best.date)} (${Math.round(best.score)}%)`;
}

function scoreByGoal(value, goal) {
  if (!goal) return 0;
  return clamp((value / goal) * 100, 0, 100);
}

function renderFinance() {
  renderFinanceSubtabs();
  renderFinanceAnalytics();
  renderFinanceOps();
}

function renderFinanceSubtabs() {
  const isAnalytics = state.ui.financeView === "analytics";
  refs.financeAnalytics.classList.toggle("active", isAnalytics);
  refs.financeOps.classList.toggle("active", !isAnalytics);
  refs.finSubtabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.finView === state.ui.financeView));

  refs.financePeriodType.value = state.ui.financePeriodType;
  refs.financeMonthFilter.value = state.ui.financeMonthFilter || currentMonthKey;
  refs.financeYearFilter.value = state.ui.financeYearFilter || String(new Date().getFullYear());
  refs.financeCustomStart.value = state.ui.financeCustomStart || "";
  refs.financeCustomEnd.value = state.ui.financeCustomEnd || "";

  const type = state.ui.financePeriodType;
  refs.financeMonthFilter.style.display = type === "month" ? "inline-block" : "none";
  refs.financeYearFilter.style.display = type === "year" ? "inline-block" : "none";
  refs.financeCustomStart.style.display = type === "custom" ? "inline-block" : "none";
  refs.financeCustomEnd.style.display = type === "custom" ? "inline-block" : "none";
}

function hydrateCategorySelects() {
  const txType = refs.txType.value;
  const txCategories = CATEGORY_BY_TYPE[txType] || CATEGORY_BY_TYPE.expense;
  refs.txCategory.innerHTML = txCategories.map((c) => `<option value="${c}">${c}</option>`).join("");

  const expenseCategories = CATEGORY_BY_TYPE.expense;
  refs.billCategory.innerHTML = expenseCategories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function filteredTransactionsForAnalytics() {
  const type = state.ui.financePeriodType;
  if (type === "month") {
    const key = state.ui.financeMonthFilter || currentMonthKey;
    return state.transactions.filter((tx) => tx.date.startsWith(key));
  }
  if (type === "year") {
    const year = state.ui.financeYearFilter || String(new Date().getFullYear());
    return state.transactions.filter((tx) => tx.date.startsWith(year));
  }
  if (!state.ui.financeCustomStart || !state.ui.financeCustomEnd) return [];
  return state.transactions.filter((tx) => tx.date >= state.ui.financeCustomStart && tx.date <= state.ui.financeCustomEnd);
}

function renderFinanceAnalytics() {
  const tx = filteredTransactionsForAnalytics();
  const income = sumByType(tx, "income");
  const expense = sumByType(tx, "expense");
  const investment = sumByType(tx, "investment");
  const balance = income - expense - investment;

  refs.finTotalIncome.textContent = formatCurrency(income);
  refs.finTotalExpense.textContent = formatCurrency(expense);
  refs.finTotalBalance.textContent = formatCurrency(balance);

  const byCategory = {};
  tx.filter((item) => item.type === "expense").forEach((item) => {
    byCategory[item.category] = (byCategory[item.category] || 0) + item.amount;
  });
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  refs.finTopCategory.textContent = entries[0] ? `${entries[0][0]} (${formatCurrency(entries[0][1])})` : "-";
  renderPie(entries, refs.financePieChart, "financePie", refs.finPieLegend);
}

function onTxSubmit(event) {
  event.preventDefault();
  const tx = {
    id: crypto.randomUUID(),
    date: refs.txDate.value,
    type: refs.txType.value,
    category: refs.txCategory.value,
    amount: Number(refs.txAmount.value),
    note: refs.txNote.value.trim()
  };
  if (!tx.date || !tx.type || !tx.category || tx.amount <= 0) return;
  state.transactions.push(tx);
  refs.txForm.reset();
  refs.txDate.value = todayKey;
  refs.txType.value = "income";
  hydrateCategorySelects();
  persistAndRender();
}

function onBudgetSubmit(event) {
  event.preventDefault();
  const area = refs.budgetArea.value.trim();
  const planned = Number(refs.budgetPlanned.value);
  if (!area || planned <= 0) return;
  const existing = state.budgets.find((b) => normalize(b.area) === normalize(area));
  if (existing) {
    existing.area = area;
    existing.planned = planned;
  } else {
    state.budgets.push({ id: crypto.randomUUID(), area, planned });
  }
  refs.budgetForm.reset();
  persistAndRender();
}

function financeBillMonthKey() {
  return state.ui.financeMonthFilter || currentMonthKey;
}

function billVersionForMonth(bill, monthKey) {
  const fallback = [{
    from: bill.createdMonth || currentMonthKey,
    name: bill.name,
    category: bill.category,
    amount: Number(bill.amount || 0),
    dueDay: Number(bill.dueDay || 1)
  }];

  const versions = Array.isArray(bill.versions) && bill.versions.length ? bill.versions : fallback;
  const sorted = [...versions].sort((a, b) => String(a.from).localeCompare(String(b.from)));
  let current = sorted[0];
  sorted.forEach((version) => {
    if (String(version.from) <= monthKey) current = version;
  });

  return {
    name: String(current.name || bill.name || ""),
    category: String(current.category || bill.category || "Outros"),
    amount: Number(current.amount || bill.amount || 0),
    dueDay: Number(current.dueDay || bill.dueDay || 1)
  };
}

function upsertBillVersion(bill, monthKey, changes) {
  if (!Array.isArray(bill.versions) || !bill.versions.length) {
    bill.versions = [{
      from: bill.createdMonth || currentMonthKey,
      name: bill.name,
      category: bill.category,
      amount: Number(bill.amount || 0),
      dueDay: Number(bill.dueDay || 1)
    }];
  }

  const index = bill.versions.findIndex((v) => String(v.from) === monthKey);
  const base = index >= 0 ? bill.versions[index] : billVersionForMonth(bill, monthKey);
  const next = { from: monthKey, ...base, ...changes };

  if (index >= 0) bill.versions[index] = next;
  else bill.versions.push(next);

  bill.name = next.name;
  bill.category = next.category;
  bill.amount = next.amount;
  bill.dueDay = next.dueDay;
}

function onBillSubmit(event) {
  event.preventDefault();
  const bill = {
    id: crypto.randomUUID(),
    name: refs.billName.value.trim(),
    category: refs.billCategory.value,
    amount: Number(refs.billAmount.value),
    dueDay: Number(refs.billDueDay.value),
    createdMonth: financeBillMonthKey(),
    versions: [],
    paid: {}
  };
  if (!bill.name || !bill.category || bill.amount <= 0 || bill.dueDay < 1 || bill.dueDay > 31) return;
  bill.versions.push({
    from: bill.createdMonth,
    name: bill.name,
    category: bill.category,
    amount: bill.amount,
    dueDay: bill.dueDay
  });
  state.bills.push(bill);
  refs.billForm.reset();
  persistAndRender();
}
function onBudgetActionClick(event) {
  const editBtn = event.target.closest("button[data-budget-edit]");
  const delBtn = event.target.closest("button[data-budget-delete]");
  if (editBtn) {
    const item = state.budgets.find((b) => b.id === editBtn.dataset.budgetEdit);
    if (!item) return;
    const area = prompt("Área:", item.area);
    if (area === null) return;
    const plannedRaw = prompt("Planejado:", String(item.planned));
    if (plannedRaw === null) return;
    const planned = Number(plannedRaw);
    if (!area.trim() || planned <= 0) return;
    item.area = area.trim();
    item.planned = planned;
    persistAndRender();
    return;
  }
  if (delBtn) {
    state.budgets = state.budgets.filter((b) => b.id !== delBtn.dataset.budgetDelete);
    persistAndRender();
  }
}

function onBillActionClick(event) {
  const toggleBtn = event.target.closest("button[data-bill-toggle]");
  const editBtn = event.target.closest("button[data-bill-edit]");
  const delBtn = event.target.closest("button[data-bill-delete]");
  const monthKey = financeBillMonthKey();

  if (toggleBtn) {
    const bill = state.bills.find((b) => b.id === toggleBtn.dataset.billToggle);
    if (!bill) return;

    const paidInfo = bill.paid[monthKey];
    if (paidInfo) {
      if (paidInfo.txId) state.transactions = state.transactions.filter((tx) => tx.id !== paidInfo.txId);
      delete bill.paid[monthKey];
    } else {
      const version = billVersionForMonth(bill, monthKey);
      const due = String(clamp(version.dueDay, 1, 31)).padStart(2, "0");
      const tx = {
        id: crypto.randomUUID(),
        date: `${monthKey}-${due}`,
        type: "expense",
        category: version.category,
        amount: version.amount,
        note: `Pagamento da conta: ${version.name}`
      };
      state.transactions.push(tx);
      bill.paid[monthKey] = { paidDate: todayKey, txId: tx.id };
    }
    persistAndRender();
    return;
  }

  if (editBtn) {
    const bill = state.bills.find((b) => b.id === editBtn.dataset.billEdit);
    if (!bill) return;

    const current = billVersionForMonth(bill, monthKey);
    const name = prompt("Nome da conta:", current.name);
    if (name === null) return;
    const category = prompt("Categoria:", current.category);
    if (category === null) return;
    const amountRaw = prompt("Valor:", String(current.amount));
    if (amountRaw === null) return;
    const dueDayRaw = prompt("Dia da conta:", String(current.dueDay));
    if (dueDayRaw === null) return;

    const amount = Number(amountRaw);
    const dueDay = Number(dueDayRaw);
    if (!name.trim() || !category.trim() || amount <= 0 || dueDay < 1 || dueDay > 31) return;

    upsertBillVersion(bill, monthKey, {
      name: name.trim(),
      category: category.trim(),
      amount,
      dueDay
    });

    persistAndRender();
    return;
  }

  if (delBtn) {
    const id = delBtn.dataset.billDelete;
    const bill = state.bills.find((b) => b.id === id);
    if (bill) {
      Object.values(bill.paid || {}).forEach((entry) => {
        if (entry.txId) state.transactions = state.transactions.filter((tx) => tx.id !== entry.txId);
      });
    }
    state.bills = state.bills.filter((b) => b.id !== id);
    persistAndRender();
  }
}

function onTxActionClick(event) {
  const editBtn = event.target.closest("button[data-tx-edit]");
  const delBtn = event.target.closest("button[data-tx-delete]");
  if (editBtn) {
    const tx = state.transactions.find((t) => t.id === editBtn.dataset.txEdit);
    if (!tx) return;
    const date = prompt("Data (AAAA-MM-DD):", tx.date);
    if (date === null) return;
    const type = prompt("Tipo (income, expense, investment):", tx.type);
    if (type === null) return;
    const category = prompt("Categoria:", tx.category);
    if (category === null) return;
    const amountRaw = prompt("Valor:", String(tx.amount));
    if (amountRaw === null) return;
    const note = prompt("Observação:", tx.note || "");
    if (note === null) return;
    const amount = Number(amountRaw);
    if (!date || !["income", "expense", "investment"].includes(type) || !category.trim() || amount <= 0) return;
    tx.date = date;
    tx.type = type;
    tx.category = category.trim();
    tx.amount = amount;
    tx.note = note.trim();
    persistAndRender();
    return;
  }
  if (delBtn) {
    state.transactions = state.transactions.filter((t) => t.id !== delBtn.dataset.txDelete);
    persistAndRender();
  }
}

function renderFinanceOps() {
  const opsMonthKey = financeBillMonthKey();
  const thisMonthTx = state.transactions.filter((tx) => tx.date.startsWith(opsMonthKey));
  const income = sumByType(thisMonthTx, "income");
  const expense = sumByType(thisMonthTx, "expense");
  const investment = sumByType(thisMonthTx, "investment");
  const balance = income - expense - investment;

  refs.financeQuickSummary.innerHTML = `
    <div class="list-item"><span>Entradas</span><strong>${formatCurrency(income)}</strong></div>
    <div class="list-item"><span>Saídas</span><strong>${formatCurrency(expense)}</strong></div>
    <div class="list-item"><span>Investimentos</span><strong>${formatCurrency(investment)}</strong></div>
    <div class="list-item"><span>Saldo atual</span><strong>${formatCurrency(balance)}</strong></div>
  `;

  refs.budgetTable.innerHTML = state.budgets.map((budget) => {
    const spent = thisMonthTx
      .filter((tx) => tx.type === "expense" && normalize(tx.category) === normalize(budget.area))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const remain = budget.planned - spent;
    const progress = budget.planned > 0 ? clamp((spent / budget.planned) * 100, 0, 100) : 0;
    return `
      <tr>
        <td>${escapeHtml(budget.area)}</td>
        <td>${formatCurrency(budget.planned)}</td>
        <td>${formatCurrency(spent)}</td>
        <td>${formatCurrency(remain)}</td>
        <td><div class="progress"><div style="width:${progress}%"></div></div></td>
        <td><button class="btn ghost" data-budget-edit="${budget.id}" type="button">Editar</button> <button class="btn danger" data-budget-delete="${budget.id}" type="button">Excluir</button></td>
      </tr>
    `;
  }).join("");

    const billMonthKey = financeBillMonthKey();
  refs.billTable.innerHTML = state.bills.map((bill) => {
    const paidInfo = bill.paid[billMonthKey];
    const paid = Boolean(paidInfo);
    const version = billVersionForMonth(bill, billMonthKey);
    return `
      <tr>
        <td>${escapeHtml(version.name)}</td>
        <td>${escapeHtml(version.category)}</td>
        <td>${formatCurrency(version.amount)}</td>
        <td>${version.dueDay}</td>
        <td>${paid ? "Paga" : "Pendente"}</td>
        <td>${paid ? formatDate(paidInfo.paidDate) : "-"}</td>
        <td>
          <button class="btn ghost" data-bill-toggle="${bill.id}" type="button">${paid ? "Desfazer" : "Marcar paga"}</button>
          <button class="btn ghost" data-bill-edit="${bill.id}" type="button">Editar</button>
          <button class="btn danger" data-bill-delete="${bill.id}" type="button">Excluir</button>
        </td>
      </tr>
    `;
  }).join("");

  const filtered = filteredTransactionsForHistory();
  refs.txTable.innerHTML = filtered.map((tx) => `
    <tr>
      <td>${formatDate(tx.date)}</td>
      <td>${labelTxType(tx.type)}</td>
      <td>${escapeHtml(tx.category)}</td>
      <td>${formatCurrency(tx.amount)}</td>
      <td>${escapeHtml(tx.note || "-")}</td>
      <td><button class="btn ghost" data-tx-edit="${tx.id}" type="button">Editar</button> <button class="btn danger" data-tx-delete="${tx.id}" type="button">Excluir</button></td>
    </tr>
  `).join("");
}

function filteredTransactionsForHistory() {
  let items = [...state.transactions];
  const start = refs.txFilterStart.value;
  const end = refs.txFilterEnd.value;
  const category = normalize(refs.txFilterCategory.value);
  const type = refs.txFilterType.value;
  if (start) items = items.filter((tx) => tx.date >= start);
  if (end) items = items.filter((tx) => tx.date <= end);
  if (category) items = items.filter((tx) => normalize(tx.category).includes(category));
  if (type !== "all") items = items.filter((tx) => tx.type === type);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

function renderPieByMonth(canvas, chartKey, monthKey, totalEl, topEl, legendEl) {
  const tx = state.transactions.filter((item) => item.type === "expense" && item.date.startsWith(monthKey));
  const byCategory = {};
  tx.forEach((item) => { byCategory[item.category] = (byCategory[item.category] || 0) + item.amount; });
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  totalEl.textContent = formatCurrency(total);
  topEl.textContent = entries[0] ? `${entries[0][0]} (${formatCurrency(entries[0][1])})` : "-";
  renderPie(entries, canvas, chartKey, legendEl);
}

function renderPie(entries, canvas, chartKey, legendEl) {
  const labels = entries.map(([label]) => label);
  const values = entries.map(([, value]) => value);
  const total = values.reduce((sum, value) => sum + value, 0);
  drawOrUpdateChart(chartKey, canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: "#fff",
        borderWidth: 1,
        backgroundColor: ["#4f5d75", "#ef8354", "#2d3142", "#7f8fa4", "#bfc7d5", "#597493", "#9ab4cf"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: "60%" }
  });

  legendEl.innerHTML = entries.length
    ? entries.map(([label, value]) => `<div class="legend-item"><span>${escapeHtml(label)}</span><strong>${((value / total) * 100).toFixed(1)}% | ${formatCurrency(value)}</strong></div>`).join("")
    : "<p class='muted'>Sem dados para o período.</p>";
}

function drawOrUpdateChart(key, canvas, config) {
  if (!window.Chart) return;
  const current = chartInstances[key];
  if (current) {
    current.data = config.data;
    current.options = config.options;
    current.update();
    return;
  }
  chartInstances[key] = new Chart(canvas, config);
}

function baseLineOptions(hideLegend, min, max) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: !hideLegend } },
    scales: {
      y: { min, max, grid: { color: "rgba(125,136,153,0.2)" } },
      x: { grid: { color: "rgba(125,136,153,0.15)" } }
    }
  };
}
function renderJournal() {
  const dateKey = state.ui.journalDate || todayKey;
  refs.journalDateInput.value = dateKey;
  refs.journalDateLabel.textContent = formatDate(dateKey);
  refs.journalText.value = state.journal[dateKey] || "";

  const entries = Object.entries(state.journal || {})
    .filter(([, text]) => String(text || "").trim())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 20);

  refs.journalEntriesList.innerHTML = entries.length
    ? entries.map(([date, text]) => `<div class="list-item"><div><strong>${formatDate(date)}</strong><p>${escapeHtml(String(text))}</p></div></div>`).join("")
    : "<p class='muted'>Sem entradas salvas.</p>";
}

function onDeleteAccount() {
  if (!confirm("Excluir todos os dados locais da conta?")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
  location.reload();
}

function sumByType(transactions, type) {
  return transactions.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0);
}

function labelTxType(type) {
  if (type === "income") return "Entrada";
  if (type === "expense") return "Saída";
  return "Investimento";
}

function markHabitToday(name) {
  const key = normalize(name);
  let habit = state.habits.find((h) => normalize(h.name) === key);
  if (!habit) {
    habit = { id: crypto.randomUUID(), name, goal: 20, logs: {} };
    state.habits.push(habit);
  }
  habit.logs[todayKey] = true;
}

function completedInMonthForHabit(habit, monthKey) {
  return Object.keys(habit.logs || {}).filter((d) => d.startsWith(monthKey)).length;
}

function daysOfMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const total = new Date(year, month, 0).getDate();
  return Array.from({ length: total }, (_, idx) => `${monthKey}-${String(idx + 1).padStart(2, "0")}`);
}

function labelMonth(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  return `${monthNames[m - 1]} ${y}`;
}

function extractNumberByWords(text, words) {
  if (!words.some((word) => text.includes(normalize(word)))) return 0;
  const match = text.match(/(\d+(?:[.,]\d+)?)/);
  return match ? toNumber(match[1]) : 0;
}

function inferExpenseCategory(text) {
  if (text.includes("mercado")) return "Mercado";
  if (text.includes("restaurante") || text.includes("ifood")) return "Alimentação";
  if (text.includes("uber") || text.includes("gasolina")) return "Transporte";
  if (text.includes("aluguel")) return "Moradia";
  if (text.includes("remédio") || text.includes("remedio") || text.includes("saúde") || text.includes("saude")) return "Saúde";
  return "Outros";
}

function average(list) {
  const valid = list.filter((n) => Number.isFinite(n) && n > 0);
  if (!valid.length) return 0;
  return valid.reduce((sum, n) => sum + n, 0) / valid.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toNumber(value) {
  return Number(String(value).replace(/\./g, "").replace(",", ".")) || 0;
}

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateShort(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}

function normalizeBills(bills) {
  if (!Array.isArray(bills)) return [];
  return bills.map((bill) => {
    const safe = bill && typeof bill === "object" ? bill : {};
    const createdMonth = String(safe.createdMonth || currentMonthKey);
    const versions = Array.isArray(safe.versions) && safe.versions.length
      ? safe.versions
      : [{
          from: createdMonth,
          name: String(safe.name || ""),
          category: String(safe.category || "Outros"),
          amount: Number(safe.amount || 0),
          dueDay: Number(safe.dueDay || 1)
        }];

    return {
      id: String(safe.id || crypto.randomUUID()),
      name: String(safe.name || versions[versions.length - 1]?.name || ""),
      category: String(safe.category || versions[versions.length - 1]?.category || "Outros"),
      amount: Number(safe.amount || versions[versions.length - 1]?.amount || 0),
      dueDay: Number(safe.dueDay || versions[versions.length - 1]?.dueDay || 1),
      createdMonth,
      versions,
      paid: safe.paid && typeof safe.paid === "object" ? safe.paid : {}
    };
  });
}
function defaultState() {
  return {
    tasks: [],
    habits: [],
    healthLogs: {},
    healthGoals: { kcal: 2000, sleep: 8, water: 2.5 },
    transactions: [],
    budgets: [],
    bills: [],
    journal: {},
    jarvisHistory: [],
    settings: {
      name: "Usuário",
      email: "usuario@email.com",
      password: "",
      theme: "light"
    },
    ui: {
      activeView: "dashboard",
      dashboardMonth: currentMonthKey,
      habitTaskDate: todayKey,
      healthPeriod: "7",
      financeView: "analytics",
      financePeriodType: "month",
      financeMonthFilter: currentMonthKey,
      financeYearFilter: String(new Date().getFullYear()),
      financeCustomStart: "",
      financeCustomEnd: "",
      journalDate: todayKey
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) },
      ui: { ...base.ui, ...(parsed.ui || {}) },
      healthGoals: { ...base.healthGoals, ...(parsed.healthGoals || {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      habits: Array.isArray(parsed.habits) ? parsed.habits : [],
      healthLogs: parsed.healthLogs && typeof parsed.healthLogs === "object" ? parsed.healthLogs : {},
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      budgets: Array.isArray(parsed.budgets) ? parsed.budgets : [],
      bills: normalizeBills(parsed.bills),
      journal: parsed.journal && typeof parsed.journal === "object" ? parsed.journal : {},
      jarvisHistory: Array.isArray(parsed.jarvisHistory) ? parsed.jarvisHistory : []
    };
  } catch (_error) {
    return defaultState();
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleRemoteSave();
}

function persistAndRender() {
  persist();
  hydrateMonthFilters();
  renderAll();
}

function scheduleRemoteSave() {
  if (!authToken) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await apiRequest("/api/state", {
        method: "PUT",
        body: JSON.stringify({ state })
      });
    } catch (_error) {
      // keep local state even if remote save fails
    }
  }, 450);
}

async function pullRemoteState() {
  try {
    const data = await apiRequest("/api/state");
    if (!data?.state || typeof data.state !== "object") return;
    hydrateStateFromRemote(data.state);
  } catch (_error) {
    // fallback to local only
  }
}

function hydrateStateFromRemote(remote) {
  const base = defaultState();
  const merged = {
    ...base,
    ...remote,
    settings: { ...base.settings, ...(remote.settings || {}) },
    ui: { ...state.ui, ...(remote.ui || {}) },
    healthGoals: { ...base.healthGoals, ...(remote.healthGoals || {}) },
    tasks: Array.isArray(remote.tasks) ? remote.tasks : [],
    habits: Array.isArray(remote.habits) ? remote.habits : [],
    healthLogs: remote.healthLogs && typeof remote.healthLogs === "object" ? remote.healthLogs : {},
    transactions: Array.isArray(remote.transactions) ? remote.transactions : [],
    budgets: Array.isArray(remote.budgets) ? remote.budgets : [],
    bills: normalizeBills(remote.bills),
    journal: remote.journal && typeof remote.journal === "object" ? remote.journal : {},
    jarvisHistory: Array.isArray(remote.jarvisHistory) ? remote.jarvisHistory : []
  };

  Object.keys(state).forEach((key) => { delete state[key]; });
  Object.assign(state, merged);
}

async function apiRequest(endpoint, options = {}, requireAuth = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (requireAuth && authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${apiBase}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Erro HTTP ${res.status}`);
  return data;
}











