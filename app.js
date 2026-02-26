
const STORAGE_KEY = "pulseboard_v4";
const SESSION_KEY = "pulseboard_session_v2";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "jarvis", label: "Jarvis" },
  { id: "habits", label: "Hábitos" },
  { id: "health", label: "Saúde" },
  { id: "finance", label: "Finanças" },
  { id: "journal", label: "Diário" },
  { id: "settings", label: "Configurações" },
  { id: "users", label: "Usuários", adminOnly: true }
];

const MENU_ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6v7H4zM14 4h6v16h-6zM4 4h6v7H4zM14 13h6v7h-6z"/></svg>`,
  jarvis: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8M12 4v2M7 9h10v7a5 5 0 0 1-10 0zM4 11h3M17 11h3M9.5 14.5h.01M14.5 14.5h.01"/></svg>`,
  habits: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12.5 11.5 15 16 9.5"/><path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/></svg>`,
  health: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7.5 7.5a3.5 3.5 0 0 1 3.5-2h2a3 3 0 1 1 0 6h-2a3 3 0 1 0 0 6h2a3.5 3.5 0 0 0 3.5-2"/></svg>`,
  journal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h9a3 3 0 0 1 3 3v13H9a3 3 0 0 0-3 3z"/><path d="M6 4v16a3 3 0 0 1 3 3"/><path d="M10 9h5M10 13h5"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 8 1.2-2.4 2.6.4.9 2.5 2.2 1.4-.8 2.5 1.5 2.2-1.9 1.9-2.2-1.5-2.5.8-1.4 2.2-2.5-.9-.4-2.6L8 12 5.8 10.6l.8-2.5L5.1 5.9 7 4l2.2 1.5 2.5-.8z"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  users: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19a4 4 0 0 0-8 0"/><circle cx="12" cy="11" r="3"/><path d="M5 19a3 3 0 0 1 3-3M19 19a3 3 0 0 0-3-3"/><circle cx="6.5" cy="11.5" r="2"/><circle cx="17.5" cy="11.5" r="2"/></svg>`
};

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
  bootScreen: document.getElementById("bootScreen"),
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

  taskEditModal: document.getElementById("taskEditModal"),
  taskEditForm: document.getElementById("taskEditForm"),
  taskEditTitle: document.getElementById("taskEditTitle"),
  taskEditCancelBtn: document.getElementById("taskEditCancelBtn"),

  jarvisForm: document.getElementById("jarvisForm"),
  jarvisInput: document.getElementById("jarvisInput"),
  jarvisSendBtn: document.getElementById("jarvisSendBtn"),
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
  settingsThemeMode: document.getElementById("settingsThemeMode"),
  settingsThemeColor: document.getElementById("settingsThemeColor"),
  deleteAccountBtn: document.getElementById("deleteAccountBtn"),
  settingsMessage: document.getElementById("settingsMessage"),

  adminUserForm: document.getElementById("adminUserForm"),
  adminUserModal: document.getElementById("adminUserModal"),
  adminOpenCreateBtn: document.getElementById("adminOpenCreateBtn"),
  adminUserCancelBtn: document.getElementById("adminUserCancelBtn"),
  adminUserEditModal: document.getElementById("adminUserEditModal"),
  adminUserEditForm: document.getElementById("adminUserEditForm"),
  adminEditName: document.getElementById("adminEditName"),
  adminEditEmail: document.getElementById("adminEditEmail"),
  adminEditPassword: document.getElementById("adminEditPassword"),
  adminEditRole: document.getElementById("adminEditRole"),
  adminEditCancelBtn: document.getElementById("adminEditCancelBtn"),
  adminUserName: document.getElementById("adminUserName"),
  adminUserEmail: document.getElementById("adminUserEmail"),
  adminUserPassword: document.getElementById("adminUserPassword"),
  adminUserRole: document.getElementById("adminUserRole"),
  adminUserMessage: document.getElementById("adminUserMessage"),
  adminUsersTable: document.getElementById("adminUsersTable"),

  habitEditModal: document.getElementById("habitEditModal"),
  habitEditForm: document.getElementById("habitEditForm"),
  habitEditName: document.getElementById("habitEditName"),
  habitEditGoal: document.getElementById("habitEditGoal"),
  habitEditCancelBtn: document.getElementById("habitEditCancelBtn"),

  txEditModal: document.getElementById("txEditModal"),
  txEditForm: document.getElementById("txEditForm"),
  txEditDate: document.getElementById("txEditDate"),
  txEditType: document.getElementById("txEditType"),
  txEditCategory: document.getElementById("txEditCategory"),
  txEditAmount: document.getElementById("txEditAmount"),
  txEditNote: document.getElementById("txEditNote"),
  txEditCancelBtn: document.getElementById("txEditCancelBtn"),

  budgetEditModal: document.getElementById("budgetEditModal"),
  budgetEditForm: document.getElementById("budgetEditForm"),
  budgetEditArea: document.getElementById("budgetEditArea"),
  budgetEditPlanned: document.getElementById("budgetEditPlanned"),
  budgetEditCancelBtn: document.getElementById("budgetEditCancelBtn"),

  billEditModal: document.getElementById("billEditModal"),
  billEditForm: document.getElementById("billEditForm"),
  billEditName: document.getElementById("billEditName"),
  billEditCategory: document.getElementById("billEditCategory"),
  billEditAmount: document.getElementById("billEditAmount"),
  billEditDueDay: document.getElementById("billEditDueDay"),
  billEditCancelBtn: document.getElementById("billEditCancelBtn"),

  confirmModal: document.getElementById("confirmModal"),
  confirmMessage: document.getElementById("confirmMessage"),
  confirmCancelBtn: document.getElementById("confirmCancelBtn"),
  confirmOkBtn: document.getElementById("confirmOkBtn")
};

const chartInstances = {};
const now = new Date();
const todayKey = isoDate(now);
const currentMonthKey = todayKey.slice(0, 7);

const state = loadState();
let authToken = "";
const LOCAL_API_URL = "http://localhost:8787";
const PROD_API_URL = "https://pulseboard-ai.onrender.com";
const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
let apiBase = String(window.API_URL || (isLocalhost ? LOCAL_API_URL : PROD_API_URL)).replace(/\/+$/, "");
let saveTimer;
let jarvisSending = false;
let editingHabitId = "";
let editingTxId = "";
let editingBudgetId = "";
let editingBillId = "";
let editingTaskId = "";
let editingAdminUserId = 0;
let confirmActionHandler = null;
let confirmBusy = false;
const THEME_MODE_ORDER = ["system", "dark", "light"];
const THEME_MODES = ["system", "light", "dark"];
const THEME_ACCENTS = ["neutral", "red", "blue", "green", "yellow", "orange", "pink", "purple"];
const LEGACY_THEME_MAP = {
  light: { themeMode: "light", themeAccent: "neutral" },
  dark: { themeMode: "dark", themeAccent: "neutral" },
  "pastel-pink": { themeMode: "light", themeAccent: "pink" },
  "pastel-green": { themeMode: "light", themeAccent: "green" },
  "pastel-blue": { themeMode: "light", themeAccent: "blue" },
  "pastel-purple": { themeMode: "light", themeAccent: "purple" },
  "black-red": { themeMode: "dark", themeAccent: "red" }
};
const THEME_PRESETS = {
  neutral: {
    light: {
      accent: "#2f3137",
      contrast: "#f6f7f8",
      check: "#4f5d75",
      moneyIn: "#2da568",
      moneyOut: "#d45454",
      chart: {
        habitLine: "#4f5d75",
        habitFill: "rgba(79,93,117,0.18)",
        kcal: "#cf4d4d",
        sleep: "#3e79cc",
        water: "#2f9b74",
        pie: ["#4f5d75", "#3f6f9b", "#2d3142", "#7f8fa4", "#bfc7d5", "#597493", "#9ab4cf"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#f0f3f8",
      contrast: "#1a2028",
      check: "#7d96bf",
      moneyIn: "#36c57e",
      moneyOut: "#ff6f6f",
      chart: {
        habitLine: "#9fb8da",
        habitFill: "rgba(159,184,218,0.2)",
        kcal: "#ff6f6f",
        sleep: "#80b0ff",
        water: "#4ed1a4",
        pie: ["#7288ab", "#6080ab", "#4c5770", "#9aabc8", "#d5def0", "#86a0c4", "#b9cbe5"],
        pieBorder: "#111419"
      }
    }
  },
  red: {
    light: {
      accent: "#e03b4f",
      contrast: "#ffffff",
      check: "#cc4f62",
      moneyIn: "#2da568",
      moneyOut: "#d45454",
      chart: {
        habitLine: "#d94157",
        habitFill: "rgba(217,65,87,0.18)",
        kcal: "#e03b4f",
        sleep: "#5a74d8",
        water: "#2f9b74",
        pie: ["#e03b4f", "#ca4c6f", "#9f586d", "#d47884", "#f0bec4", "#ad4358", "#f5d9dc"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#ff4d6d",
      contrast: "#1e0f15",
      check: "#ff708d",
      moneyIn: "#36c57e",
      moneyOut: "#ff6f6f",
      chart: {
        habitLine: "#ff6b85",
        habitFill: "rgba(255,107,133,0.2)",
        kcal: "#ff7d8f",
        sleep: "#7fa6ff",
        water: "#54d7ab",
        pie: ["#ff4d6d", "#f56f8a", "#be6e84", "#e08fa4", "#f5c7d2", "#d15e7b", "#fadbe3"],
        pieBorder: "#111419"
      }
    }
  },
  blue: {
    light: {
      accent: "#3d74d8",
      contrast: "#ffffff",
      check: "#4f79c4",
      moneyIn: "#2f9a57",
      moneyOut: "#b55151",
      chart: {
        habitLine: "#3d74d8",
        habitFill: "rgba(61,116,216,0.18)",
        kcal: "#c15b5b",
        sleep: "#3d74d8",
        water: "#2f9b74",
        pie: ["#3d74d8", "#547fc9", "#5f7392", "#7d9cd6", "#bfd4f8", "#6a8fcb", "#dbe7fb"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#78a8ff",
      contrast: "#10203a",
      check: "#8eb7ff",
      moneyIn: "#36c57e",
      moneyOut: "#ff6f6f",
      chart: {
        habitLine: "#8ab5ff",
        habitFill: "rgba(138,181,255,0.2)",
        kcal: "#ff8d86",
        sleep: "#88b4ff",
        water: "#57d4ab",
        pie: ["#78a8ff", "#8ab2f1", "#7890c0", "#9db8ea", "#d3e1fb", "#7f9fd9", "#e2ebff"],
        pieBorder: "#111419"
      }
    }
  },
  green: {
    light: {
      accent: "#2f9f6b",
      contrast: "#ffffff",
      check: "#3f966f",
      moneyIn: "#2f9f6b",
      moneyOut: "#b55151",
      chart: {
        habitLine: "#2f9f6b",
        habitFill: "rgba(47,159,107,0.18)",
        kcal: "#c5645e",
        sleep: "#5f7ecf",
        water: "#2f9f6b",
        pie: ["#2f9f6b", "#4ca679", "#638f78", "#8dc3a4", "#d2ecdd", "#5f9f83", "#e0f3e7"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#5fd69a",
      contrast: "#132a1f",
      check: "#76e0ae",
      moneyIn: "#5fd69a",
      moneyOut: "#ff6f6f",
      chart: {
        habitLine: "#78e2ae",
        habitFill: "rgba(120,226,174,0.2)",
        kcal: "#ff8f87",
        sleep: "#8ab0ff",
        water: "#6ae3bb",
        pie: ["#5fd69a", "#79d9aa", "#78a790", "#9ad8b7", "#d6f3e5", "#70c49a", "#e5f8ef"],
        pieBorder: "#111419"
      }
    }
  },
  yellow: {
    light: {
      accent: "#d8a600",
      contrast: "#221b06",
      check: "#be9a2d",
      moneyIn: "#2f9a57",
      moneyOut: "#b55151",
      chart: {
        habitLine: "#c89500",
        habitFill: "rgba(200,149,0,0.2)",
        kcal: "#c8654f",
        sleep: "#5676cb",
        water: "#3c9d7b",
        pie: ["#d8a600", "#d09e31", "#b68f4c", "#d4b36d", "#f1e1b2", "#b48720", "#f7edcf"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#ffd24d",
      contrast: "#2a220d",
      check: "#ffde7f",
      moneyIn: "#5fd69a",
      moneyOut: "#ff7f7f",
      chart: {
        habitLine: "#ffda6d",
        habitFill: "rgba(255,218,109,0.22)",
        kcal: "#ff9d84",
        sleep: "#90b5ff",
        water: "#6bdcb5",
        pie: ["#ffd24d", "#f3c967", "#cfb16a", "#e7ce8d", "#f8ebc8", "#d5b447", "#fff2d6"],
        pieBorder: "#111419"
      }
    }
  },
  orange: {
    light: {
      accent: "#dc6f2f",
      contrast: "#ffffff",
      check: "#c07a51",
      moneyIn: "#2f9a57",
      moneyOut: "#b55151",
      chart: {
        habitLine: "#dc6f2f",
        habitFill: "rgba(220,111,47,0.18)",
        kcal: "#cc5c4a",
        sleep: "#5a78cc",
        water: "#3f9e80",
        pie: ["#dc6f2f", "#cd834f", "#b08467", "#d4a17f", "#efd5c3", "#c26125", "#f6e5db"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#ff9a5c",
      contrast: "#2f1909",
      check: "#ffb685",
      moneyIn: "#5fd69a",
      moneyOut: "#ff7f7f",
      chart: {
        habitLine: "#ffad79",
        habitFill: "rgba(255,173,121,0.22)",
        kcal: "#ff9f89",
        sleep: "#90b4ff",
        water: "#6fdfbd",
        pie: ["#ff9a5c", "#f3a274", "#cf9b79", "#e2b595", "#f5dfd0", "#d9854f", "#fae9df"],
        pieBorder: "#111419"
      }
    }
  },
  pink: {
    light: {
      accent: "#d86aa0",
      contrast: "#ffffff",
      check: "#c277a1",
      moneyIn: "#3baf7a",
      moneyOut: "#c7516c",
      chart: {
        habitLine: "#d86aa0",
        habitFill: "rgba(216,106,160,0.18)",
        kcal: "#ca5f69",
        sleep: "#7a89d8",
        water: "#4ea786",
        pie: ["#d86aa0", "#c989b8", "#b188a2", "#c6b2cf", "#e9d7e2", "#a285c2", "#f1bfd0"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#ff8ec2",
      contrast: "#321225",
      check: "#ffaad3",
      moneyIn: "#5fd69a",
      moneyOut: "#ff8aa4",
      chart: {
        habitLine: "#ff9ecd",
        habitFill: "rgba(255,158,205,0.22)",
        kcal: "#ff95a3",
        sleep: "#a1b4ff",
        water: "#72e4c2",
        pie: ["#ff8ec2", "#f39ec9", "#c68ba9", "#dfb2ca", "#f6dcea", "#d978b1", "#fae7f2"],
        pieBorder: "#111419"
      }
    }
  },
  purple: {
    light: {
      accent: "#8c66d9",
      contrast: "#ffffff",
      check: "#7f74c4",
      moneyIn: "#3a9b76",
      moneyOut: "#b55555",
      chart: {
        habitLine: "#8c66d9",
        habitFill: "rgba(140,102,217,0.18)",
        kcal: "#cb6a7a",
        sleep: "#6f86d6",
        water: "#4d9f8a",
        pie: ["#8c66d9", "#8d84c6", "#7e6aa6", "#b7a0df", "#e8defa", "#927dc3", "#cbb8eb"],
        pieBorder: "#ffffff"
      }
    },
    dark: {
      accent: "#b594ff",
      contrast: "#261445",
      check: "#c5adff",
      moneyIn: "#5fd69a",
      moneyOut: "#ff8b8b",
      chart: {
        habitLine: "#c3aaff",
        habitFill: "rgba(195,170,255,0.22)",
        kcal: "#ff97a7",
        sleep: "#a9bfff",
        water: "#78e3c4",
        pie: ["#b594ff", "#b2a4ea", "#9786c4", "#cab8f4", "#ece4ff", "#a793de", "#ddd0ff"],
        pieBorder: "#111419"
      }
    }
  }
};
let currentUser = null;
let adminUsers = [];
let currentStateOwnerId = 0;
let systemThemeListenerBound = false;
bootstrap();

async function bootstrap() {
  showBootstrapLoading();
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
  syncThemeControlsFromState();
  refs.goalKcal.value = state.healthGoals.kcal || "";
  refs.goalSleep.value = state.healthGoals.sleep || "";
  refs.goalWater.value = state.healthGoals.water || "";
  refs.journalText.value = state.journal[state.ui.journalDate] || "";

  buildMenu();
  bindEvents();
  applyTheme();
  hydrateCategorySelects();
  hydrateMonthFilters();

  const session = loadSession();
  updateJarvisSendState();

  const restored = await restoreSession(session);
  if (restored) {
    showApp();
  } else {
    showLogin();
  }

  renderAll();
}

async function restoreSession(session) {
  if (!session?.token) return false;

  authToken = session.token;
  if (session.user) {
    applyLoggedUser(session.user);
  }

  const restoreResult = await fetchCurrentUserWithRetry(3);
  if (restoreResult.user) {
    applyLoggedUser(restoreResult.user);
    saveSession({ token: authToken, user: restoreResult.user });
    await pullRemoteState();
    if (isAdminUser()) await loadAdminUsers();
    return true;
  }

  if (restoreResult.invalidToken) {
    clearSessionLocal();
    return false;
  }

  if (session.user) {
    await pullRemoteState();
    if (isAdminUser()) void loadAdminUsers();
    return true;
  }

  return false;
}

async function fetchCurrentUserWithRetry(maxAttempts = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const me = await apiRequest("/api/auth/me");
      if (me?.user) return { user: me.user, error: null, invalidToken: false };
      return { user: null, error: null, invalidToken: false };
    } catch (error) {
      lastError = error;
      if (isSessionAuthError(error)) {
        return { user: null, error, invalidToken: true };
      }
      if (!shouldRetrySessionValidation(error) || attempt >= maxAttempts) {
        break;
      }
      await wait(500 * attempt);
    }
  }

  return { user: null, error: lastError, invalidToken: false };
}

function isSessionAuthError(error) {
  const status = Number(error?.status || 0);
  return status === 401 || status === 403;
}

function shouldRetrySessionValidation(error) {
  const status = Number(error?.status || 0);
  if (!status) return true;
  return status >= 500;
}

function clearSessionLocal() {
  localStorage.removeItem(SESSION_KEY);
  authToken = "";
  currentUser = null;
  currentStateOwnerId = 0;
  adminUsers = [];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  refs.taskEditForm.addEventListener("submit", onTaskEditSubmit);
  refs.taskEditCancelBtn.addEventListener("click", closeTaskEditModal);
  refs.taskEditModal.addEventListener("click", (event) => {
    if (event.target === refs.taskEditModal) closeTaskEditModal();
  });

  refs.jarvisForm.addEventListener("submit", onJarvisSubmit);
  refs.jarvisInput.addEventListener("input", updateJarvisSendState);

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
  refs.adminUserForm?.addEventListener("submit", onAdminUserSubmit);
  refs.adminUsersTable?.addEventListener("click", onAdminUserActionClick);
  refs.adminOpenCreateBtn?.addEventListener("click", openAdminUserModal);
  refs.adminUserCancelBtn?.addEventListener("click", closeAdminUserModal);
  refs.adminUserModal?.addEventListener("click", (event) => {
    if (event.target === refs.adminUserModal) closeAdminUserModal();
  });
  refs.adminUserEditForm?.addEventListener("submit", onAdminUserEditSubmit);
  refs.adminEditCancelBtn?.addEventListener("click", closeAdminUserEditModal);
  refs.adminUserEditModal?.addEventListener("click", (event) => {
    if (event.target === refs.adminUserEditModal) closeAdminUserEditModal();
  });

  [refs.settingsThemeMode, refs.settingsThemeColor].forEach((el) => {
    el.addEventListener("change", onThemeSettingsChange);
  });
  refs.deleteAccountBtn.addEventListener("click", onDeleteAccount);

  if (!systemThemeListenerBound) {
    const onSystemThemeChange = () => {
      if (state.settings.themeMode !== "system") return;
      applyTheme();
      renderAll();
    };
    if (typeof systemThemeQuery.addEventListener === "function") {
      systemThemeQuery.addEventListener("change", onSystemThemeChange);
    } else if (typeof systemThemeQuery.addListener === "function") {
      systemThemeQuery.addListener(onSystemThemeChange);
    }
    systemThemeListenerBound = true;
  }

  refs.habitEditForm.addEventListener("submit", onHabitEditSubmit);
  refs.habitEditCancelBtn.addEventListener("click", closeHabitEditModal);
  refs.habitEditModal.addEventListener("click", (event) => {
    if (event.target === refs.habitEditModal) closeHabitEditModal();
  });

  refs.txEditForm.addEventListener("submit", onTxEditSubmit);
  refs.txEditCancelBtn.addEventListener("click", closeTxEditModal);
  refs.txEditModal.addEventListener("click", (event) => {
    if (event.target === refs.txEditModal) closeTxEditModal();
  });
  refs.txEditType.addEventListener("change", hydrateTxEditCategorySelect);

  refs.budgetEditForm.addEventListener("submit", onBudgetEditSubmit);
  refs.budgetEditCancelBtn.addEventListener("click", closeBudgetEditModal);
  refs.budgetEditModal.addEventListener("click", (event) => {
    if (event.target === refs.budgetEditModal) closeBudgetEditModal();
  });

  refs.billEditForm.addEventListener("submit", onBillEditSubmit);
  refs.billEditCancelBtn.addEventListener("click", closeBillEditModal);
  refs.billEditModal.addEventListener("click", (event) => {
    if (event.target === refs.billEditModal) closeBillEditModal();
  });

  refs.confirmCancelBtn.addEventListener("click", closeConfirmModal);
  refs.confirmOkBtn.addEventListener("click", async () => {
    if (confirmBusy) return;
    if (typeof confirmActionHandler !== "function") {
      closeConfirmModal();
      return;
    }
    try {
      confirmBusy = true;
      refs.confirmOkBtn.disabled = true;
      refs.confirmOkBtn.textContent = "Confirmando...";
      await confirmActionHandler();
      closeConfirmModal();
    } finally {
      confirmBusy = false;
      refs.confirmOkBtn.disabled = false;
      refs.confirmOkBtn.textContent = "Confirmar";
    }
  });
  refs.confirmModal.addEventListener("click", (event) => {
    if (event.target === refs.confirmModal) closeConfirmModal();
  });
}

async function onLoginSubmit(event) {
  event.preventDefault();
  clearTimeout(saveTimer);
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
    hydrateStateFromRemote(defaultState());
    currentStateOwnerId = Number(data?.user?.id || 0);
    await pullRemoteState();
    applyLoggedUser(data.user || null);
    if (isAdminUser()) await loadAdminUsers();
    refs.loginForm.reset();
    showApp();
    renderAll();
  } catch (error) {
    const status = Number(error?.status || 0);
    if (status === 401 || status === 403) {
      refs.loginError.textContent = "Email ou senha incorreto";
      return;
    }
    if (status === 0) {
      refs.loginError.textContent = "Não foi possível conectar com o servidor de login.";
      return;
    }
    refs.loginError.textContent = "Não foi possível fazer login agora. Tente novamente.";
  }
}

function onLogout() {
  clearTimeout(saveTimer);
  clearSessionLocal();
  refs.loginError.textContent = "";
  if (refs.settingsMessage) refs.settingsMessage.textContent = "";
  buildMenu();
  showLogin();
}

function applyLoggedUser(user) {
  if (!user) return;
  currentUser = {
    id: Number(user.id || 0),
    name: String(user.name || ""),
    email: String(user.email || ""),
    role: String(user.role || "user")
  };
  currentStateOwnerId = Number(user.id || 0);
  state.settings.name = String(user.name || state.settings.name || "");
  state.settings.email = String(user.email || state.settings.email || "");

  refs.settingsName.value = state.settings.name;
  refs.settingsEmail.value = state.settings.email;
  if (state.ui.activeView === "users" && !isAdminUser()) {
    state.ui.activeView = "dashboard";
  }
  buildMenu();
}

function isAdminUser() {
  return currentUser?.role === "admin";
}

function openAdminUserModal() {
  if (!isAdminUser()) return;
  refs.adminUserForm?.reset();
  if (refs.adminUserRole) refs.adminUserRole.value = "user";
  refs.adminUserModal?.classList.remove("hidden");
}

function closeAdminUserModal() {
  refs.adminUserModal?.classList.add("hidden");
}

async function loadAdminUsers() {
  if (!isAdminUser() || !authToken) return;
  try {
    const data = await apiRequest("/api/admin/users");
    adminUsers = Array.isArray(data?.users) ? data.users : [];
    renderUsersAdmin();
  } catch (error) {
    if (refs.adminUserMessage) refs.adminUserMessage.textContent = error?.message || "Não foi possível carregar usuários.";
  }
}

async function onAdminUserSubmit(event) {
  event.preventDefault();
  if (!isAdminUser()) return;
  const payload = {
    name: refs.adminUserName.value.trim(),
    email: refs.adminUserEmail.value.trim().toLowerCase(),
    password: refs.adminUserPassword.value,
    role: refs.adminUserRole.value
  };

  if (!payload.name || !payload.email || !payload.password) return;

  openConfirmModal(`Criar usuário ${payload.email}?`, async () => {
    try {
      await apiRequest("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      refs.adminUserForm.reset();
      refs.adminUserRole.value = "user";
      refs.adminUserMessage.textContent = "Usuário criado com sucesso.";
      closeAdminUserModal();
      await loadAdminUsers();
    } catch (error) {
      refs.adminUserMessage.textContent = error?.message || "Não foi possível criar o usuário.";
    }
  });
}

async function onAdminUserActionClick(event) {
  const editBtn = event.target.closest("button[data-admin-edit]");
  const delBtn = event.target.closest("button[data-admin-delete]");
  if (!isAdminUser()) return;

  if (editBtn) {
    const userId = Number(editBtn.dataset.adminEdit);
    const current = adminUsers.find((user) => Number(user.id) === userId);
    if (!current) return;
    openAdminUserEditModal(current);
    return;
  }

  if (delBtn) {
    const userId = Number(delBtn.dataset.adminDelete);
    const current = adminUsers.find((user) => Number(user.id) === userId);
    if (!current) return;
    if (Number(current.id) === Number(currentUser?.id)) {
      refs.adminUserMessage.textContent = "Você não pode excluir o próprio usuário.";
      return;
    }
    openConfirmModal(`Excluir usuário ${current.email}?`, async () => {
      try {
        await apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" });
        await loadAdminUsers();
      } catch (error) {
        refs.adminUserMessage.textContent = error?.message || "Não foi possível excluir o usuário.";
      }
    });
  }
}

function openAdminUserEditModal(user) {
  editingAdminUserId = Number(user.id || 0);
  refs.adminEditName.value = String(user.name || "");
  refs.adminEditEmail.value = String(user.email || "");
  refs.adminEditPassword.value = "";
  refs.adminEditRole.value = user.role === "admin" ? "admin" : "user";
  refs.adminUserEditModal.classList.remove("hidden");
}

function closeAdminUserEditModal() {
  editingAdminUserId = 0;
  refs.adminUserEditModal.classList.add("hidden");
}

async function onAdminUserEditSubmit(event) {
  event.preventDefault();
  if (!isAdminUser() || !editingAdminUserId) return;

  const payload = {
    name: refs.adminEditName.value.trim(),
    email: refs.adminEditEmail.value.trim().toLowerCase(),
    role: refs.adminEditRole.value,
    password: refs.adminEditPassword.value
  };
  if (!payload.name || !payload.email || !payload.role) return;

  openConfirmModal(`Salvar alterações de ${payload.email}?`, async () => {
    try {
      await apiRequest(`/api/admin/users/${editingAdminUserId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      closeAdminUserEditModal();
      refs.adminUserMessage.textContent = "Usuário atualizado com sucesso.";
      await loadAdminUsers();
    } catch (error) {
      refs.adminUserMessage.textContent = error?.message || "Não foi possível atualizar o usuário.";
    }
  });
}

function renderUsersAdmin() {
  if (!refs.adminUsersTable) return;
  if (!isAdminUser()) {
    refs.adminUsersTable.innerHTML = "";
    if (refs.adminUserMessage) refs.adminUserMessage.textContent = "";
    return;
  }
  refs.adminUsersTable.innerHTML = adminUsers.length
    ? adminUsers.map((user) => `
      <tr>
        <td>${escapeHtml(String(user.name || ""))}</td>
        <td>${escapeHtml(String(user.email || ""))}</td>
        <td>${user.role === "admin" ? "Administrador" : "Usuário"}</td>
        <td>${user.createdAt ? formatDateTime(user.createdAt) : "-"}</td>
        <td>
          <button class="btn ghost" data-admin-edit="${user.id}" type="button">Editar</button>
          <button class="btn danger" data-admin-delete="${user.id}" type="button">Excluir</button>
        </td>
      </tr>
    `).join("")
    : "<tr><td colspan='5' class='muted'>Sem usuários cadastrados.</td></tr>";
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
    state.settings.themeMode = normalizeThemeMode(refs.settingsThemeMode.value);
    state.settings.themeAccent = normalizeThemeAccent(refs.settingsThemeColor.value);
    syncThemeControlsFromState();
    applyTheme();
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

function showBootstrapLoading() {
  refs.bootScreen.classList.remove("hidden");
  refs.loginScreen.classList.add("hidden");
  refs.appShell.classList.add("hidden");
}

function showLogin() {
  refs.bootScreen.classList.add("hidden");
  refs.loginScreen.classList.remove("hidden");
  refs.appShell.classList.add("hidden");
  updateJarvisSendState();
}

function showApp() {
  refs.bootScreen.classList.add("hidden");
  refs.loginScreen.classList.add("hidden");
  refs.appShell.classList.remove("hidden");
  updateJarvisSendState();
}

function onThemeToggle() {
  const currentMode = normalizeThemeMode(state.settings.themeMode);
  const currentIndex = THEME_MODE_ORDER.indexOf(currentMode);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % THEME_MODE_ORDER.length : 0;
  state.settings.themeMode = THEME_MODE_ORDER[nextIndex];
  syncThemeControlsFromState();
  applyTheme();
  renderAll();
  persist();
}

function onThemeSettingsChange() {
  state.settings.themeMode = normalizeThemeMode(refs.settingsThemeMode.value);
  state.settings.themeAccent = normalizeThemeAccent(refs.settingsThemeColor.value);
  syncThemeControlsFromState();
  applyTheme();
  renderAll();
  persist();
}

function syncThemeControlsFromState() {
  state.settings = normalizeThemeSettings(state.settings);
  refs.settingsThemeMode.value = state.settings.themeMode;
  refs.settingsThemeColor.value = state.settings.themeAccent;
}

function buildMenu() {
  const visibleMenu = MENU_ITEMS.filter((item) => !item.adminOnly || isAdminUser());
  if (!visibleMenu.some((item) => item.id === state.ui.activeView)) {
    state.ui.activeView = "dashboard";
  }
  refs.menu.innerHTML = visibleMenu.map((item) => `
    <button class="menu-btn ${item.id === state.ui.activeView ? "active" : ""}" data-view="${item.id}" type="button" aria-label="${item.label}">
      <span class="menu-icon">${MENU_ICONS[item.id] || ""}</span>
      <span class="menu-label">${item.label}</span>
    </button>
  `).join("");
  refs.menu.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.ui.activeView = btn.dataset.view;
      persistAndRender();
    });
  });
}

function renderAll() {
  buildMenu();
  renderActiveView();
  renderDashboard();
  renderJarvis();
  renderHabits();
  renderHealth();
  renderFinance();
  renderJournal();
  renderUsersAdmin();
}

function renderActiveView() {
  if (state.ui.activeView === "users" && !isAdminUser()) {
    state.ui.activeView = "dashboard";
  }
  refs.views.forEach((view) => view.classList.remove("active"));
  document.getElementById(`view-${state.ui.activeView}`)?.classList.add("active");
  refs.menu.querySelectorAll(".menu-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.view === state.ui.activeView));
  refs.headerTitle.textContent = MENU_ITEMS.find((i) => i.id === state.ui.activeView)?.label || "Dashboard";
  if (state.ui.activeView === "jarvis") {
    requestAnimationFrame(() => {
      refs.jarvisHistory.scrollTop = refs.jarvisHistory.scrollHeight;
    });
  }
  if (state.ui.activeView === "users" && isAdminUser()) {
    void loadAdminUsers();
  }
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
  state.tasks.push({ id: crypto.randomUUID(), title, date: todayKey, done: false, sortOrder: nextTaskSortOrder(todayKey) });
  refs.dashTaskForm.reset();
  persistAndRender();
}

function onTaskAddByDate(event) {
  event.preventDefault();
  const title = refs.habitTaskInput.value.trim();
  const date = state.ui.habitTaskDate || todayKey;
  if (!title) return;
  state.tasks.push({ id: crypto.randomUUID(), title, date, done: false, sortOrder: nextTaskSortOrder(date) });
  refs.habitTaskForm.reset();
  persistAndRender();
}

function renderTaskLists() {
  normalizeTaskOrder(todayKey);
  const todayTasks = orderedTasksByDate(todayKey);
  refs.dashTaskCounter.textContent = `${todayTasks.filter((t) => t.done).length}/${todayTasks.length} concluídas`;
  refs.dashTaskList.innerHTML = todayTasks.length ? todayTasks.map((task, index) => taskItemHtml(task, index, todayTasks.length)).join("") : "<p class='muted'>Sem tarefas hoje.</p>";

  const date = state.ui.habitTaskDate || todayKey;
  normalizeTaskOrder(date);
  refs.habitTaskDateFilter.value = date;
  refs.habitCalendarLabel.textContent = formatDate(date);
  const habitTasks = orderedTasksByDate(date);
  refs.habitTaskList.innerHTML = habitTasks.length ? habitTasks.map((task, index) => taskItemHtml(task, index, habitTasks.length)).join("") : "<p class='muted'>Sem tarefas nesta data.</p>";
}

function taskItemHtml(task, index, total) {
  return `
    <div class="list-item ${task.done ? "done" : ""}">
      <div>
        <strong>${escapeHtml(task.title)}</strong>
        <p class="muted">${formatDate(task.date)}</p>
      </div>
      <div class="item-actions">
        <button class="btn ghost task-move-btn" type="button" data-task-action="move-up" data-task-id="${task.id}" ${index <= 0 ? "disabled" : ""}>↑</button>
        <button class="btn ghost task-move-btn" type="button" data-task-action="move-down" data-task-id="${task.id}" ${index >= total - 1 ? "disabled" : ""}>↓</button>
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
  const action = button.dataset.taskAction;
  if (action === "toggle") task.done = !task.done;
  if (action === "edit") {
    openTaskEditModal(task.id);
    return;
  }
  if (action === "move-up") {
    moveTask(task, -1);
    persistAndRender();
    return;
  }
  if (action === "move-down") {
    moveTask(task, 1);
    persistAndRender();
    return;
  }
  if (action === "delete") state.tasks = state.tasks.filter((t) => t.id !== task.id);
  persistAndRender();
}

function orderedTasksByDate(date) {
  return state.tasks
    .filter((task) => task.date === date)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function nextTaskSortOrder(date) {
  const maxOrder = state.tasks
    .filter((task) => task.date === date)
    .reduce((max, task) => Math.max(max, Number(task.sortOrder || 0)), 0);
  return maxOrder + 1;
}

function normalizeTaskOrder(date) {
  orderedTasksByDate(date).forEach((task, index) => {
    task.sortOrder = index + 1;
  });
}

function findTaskByDateAndTitle(title, date = todayKey) {
  const key = normalize(title);
  if (!key) return null;
  const sameDay = state.tasks.filter((task) => task.date === date);
  const exact = sameDay.find((task) => normalize(task.title) === key);
  if (exact) return exact;
  const partial = sameDay.find((task) => {
    const taskKey = normalize(task.title);
    return taskKey.includes(key) || key.includes(taskKey);
  });
  return partial || null;
}

function createTaskByDate(title, date = todayKey, done = false) {
  const safeTitle = String(title || "").trim();
  if (!safeTitle) return null;
  const task = {
    id: crypto.randomUUID(),
    title: safeTitle,
    date,
    done: Boolean(done),
    sortOrder: nextTaskSortOrder(date)
  };
  state.tasks.push(task);
  normalizeTaskOrder(date);
  return task;
}

function moveTask(task, direction) {
  const list = orderedTasksByDate(task.date);
  const from = list.findIndex((item) => item.id === task.id);
  if (from < 0) return;
  const to = from + direction;
  if (to < 0 || to >= list.length) return;
  const target = list[to];
  const tmp = Number(task.sortOrder || from + 1);
  task.sortOrder = Number(target.sortOrder || to + 1);
  target.sortOrder = tmp;
  normalizeTaskOrder(task.date);
}

function openTaskEditModal(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return;
  editingTaskId = task.id;
  refs.taskEditTitle.value = task.title;
  refs.taskEditModal.classList.remove("hidden");
}

function closeTaskEditModal() {
  editingTaskId = "";
  refs.taskEditModal.classList.add("hidden");
}

function onTaskEditSubmit(event) {
  event.preventDefault();
  const task = state.tasks.find((item) => item.id === editingTaskId);
  if (!task) return;
  const title = refs.taskEditTitle.value.trim();
  if (!title) return;
  task.title = title;
  closeTaskEditModal();
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

  requestAnimationFrame(() => {
    refs.jarvisHistory.scrollTop = refs.jarvisHistory.scrollHeight;
  });
}

async function onJarvisSubmit(event) {
  event.preventDefault();
  const text = refs.jarvisInput.value.trim();
  if (!text || !authToken || jarvisSending) return;

  jarvisSending = true;
  updateJarvisSendState();

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
  jarvisSending = false;
  updateJarvisSendState();
  persistAndRender();
}

function updateJarvisSendState() {
  const hasText = refs.jarvisInput.value.trim().length > 0;
  refs.jarvisSendBtn.disabled = !hasText || jarvisSending || !authToken;
  refs.jarvisSendBtn.textContent = jarvisSending ? "Enviando..." : "Enviar";
}

function formatJarvisError(error) {
  const msg = String(error?.message || "");
  const lower = msg.toLowerCase();
  const status = Number(error?.status || 0);
  if (status === 429 || lower.includes("429") || lower.includes("quota") || lower.includes("billing")) {
    return "Seu limite da IA foi atingido. Verifique plano e faturamento da API.";
  }
  if (status === 401 || lower.includes("401") || lower.includes("api key") || lower.includes("incorrect api key")) {
    return "Chave da IA inválida ou ausente no backend.";
  }
  if (status === 0 || lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("falha de conexão")) {
    return `Não foi possível conectar ao backend Jarvis (${apiBase}).`;
  }
  if (lower.includes("status code (no body)") || lower.includes("requisição")) {
    return "A IA recusou a requisição. Verifique modelo/permissão da chave.";
  }
  return msg || `Falha ao chamar Jarvis no backend (${apiBase}).`;
}

function applyJarvisActions(actions) {
  const applied = [];

  actions.forEach((action) => {
    const actionType = normalize(action?.type || "");
    const actionDate = normalizeActionDate(action?.date);

    if (actionType === "transaction") {
      const txType = ["income", "expense", "investment"].includes(action.txType) ? action.txType : "expense";
      const amount = Number(action.amount || 0);
      if (amount > 0) {
        state.transactions.push({
          id: crypto.randomUUID(),
          date: actionDate,
          type: txType,
          category: String(action.category || "Outros"),
          amount,
          note: String(action.note || "Jarvis")
        });
        applied.push(`Transação ${txType}: ${formatCurrency(amount)}`);
      }
      return;
    }

    if (["task_add", "task_create", "add_task", "create_task", "tarefa_add"].includes(actionType)) {
      const title = String(action.title || action.name || "").trim();
      if (!title) return;
      const existing = findTaskByDateAndTitle(title, actionDate);
      if (existing) {
        applied.push(`Tarefa já existe: ${existing.title} (${formatDate(actionDate)})`);
        return;
      }
      const created = createTaskByDate(title, actionDate, false);
      if (created) {
        applied.push(`Tarefa criada: ${created.title} (${formatDate(actionDate)})`);
      }
      return;
    }

    if (["task_done", "task_complete", "complete_task", "task_check"].includes(actionType)) {
      const title = String(action.title || action.name || "").trim();
      if (!title) return;
      const found = findTaskByDateAndTitle(title, actionDate);
      if (found) {
        found.done = true;
        applied.push(`Tarefa concluída: ${found.title} (${formatDate(actionDate)})`);
        return;
      }
      const created = createTaskByDate(title, actionDate, true);
      if (created) {
        applied.push(`Tarefa criada e concluída: ${created.title} (${formatDate(actionDate)})`);
      }
      return;
    }

    if (["task_undo", "task_uncheck", "task_reopen", "undo_task"].includes(actionType)) {
      const title = String(action.title || action.name || "").trim();
      if (!title) return;
      const found = findTaskByDateAndTitle(title, actionDate);
      if (!found) {
        applied.push(`Não encontrei a tarefa "${title}" em ${formatDate(actionDate)}.`);
        return;
      }
      found.done = false;
      applied.push(`Tarefa reaberta: ${found.title} (${formatDate(actionDate)})`);
      return;
    }

    if (["task_delete", "task_remove", "remove_task", "delete_task"].includes(actionType)) {
      const title = String(action.title || action.name || "").trim();
      if (!title) return;
      const found = findTaskByDateAndTitle(title, actionDate);
      if (!found) {
        applied.push(`Não encontrei a tarefa "${title}" para excluir.`);
        return;
      }
      state.tasks = state.tasks.filter((task) => task.id !== found.id);
      normalizeTaskOrder(actionDate);
      applied.push(`Tarefa excluída: ${found.title} (${formatDate(actionDate)})`);
      return;
    }

    if (["habit_done", "habit mark", "habit_mark", "marcar_habito"].includes(actionType)) {
      const name = String(action.name || "Hábito");
      markHabitByDate(name, actionDate);
      applied.push(`Hábito marcado: ${name} (${formatDate(actionDate)})`);
      return;
    }

    if (["habit_undo", "habit_unmark", "unmark_habit", "desmarcar_habito", "habit_remove"].includes(actionType)) {
      const name = String(action.name || "Hábito");
      const removed = unmarkHabitByDate(name, actionDate);
      applied.push(removed
        ? `Hábito desmarcado: ${name} (${formatDate(actionDate)})`
        : `Não encontrei ${name} marcado em ${formatDate(actionDate)}.`);
      return;
    }

    if (actionType === "kcal") {
      const kcal = Number(action.value || 0);
      if (kcal > 0) applied.push('Estimativa de kcal: ' + kcal + ' (sem registro automático)');
      return;
    }

    if (actionType === "health") {
      const sleep = Number(action.sleep || 0);
      const water = Number(action.water || 0);
      const details = [];
      if (sleep > 0) details.push('sono ' + sleep + 'h');
      if (water > 0) details.push('água ' + water + 'L');
      if (details.length) applied.push('Estimativa de saúde: ' + details.join(' | ') + ' (sem registro automático)');
    }
  });

  return applied;
}

function normalizeActionDate(value) {
  const raw = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return todayKey;
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

  openConfirmModal('Adicionar hábito "' + name + '" com meta ' + goal + ' dias?', () => {
    state.habits.push({ id: crypto.randomUUID(), name, goal, logs: {} });
    refs.habitForm.reset();
    refs.habitGoal.value = "20";
    persistAndRender();
  });
}

function renderHabitGrid() {
  const days = daysOfMonth(currentMonthKey);
  const headCells = ["<th class='habit-name'>Hábito</th>", "<th class='goal-col'>Meta</th>"];
  days.forEach((d) => headCells.push(`<th class='check-col'>${Number(d.slice(-2))}</th>`));
  headCells.push("<th class='exec-col'>Execução</th>");
  headCells.push("<th class='progress-col'>Progresso</th>");
  headCells.push("<th class='action-col'>Ações</th>");
  refs.habitGridHead.innerHTML = `<tr>${headCells.join("")}</tr>`;

  refs.habitGridBody.innerHTML = state.habits.map((habit) => {
    const done = completedInMonthForHabit(habit, currentMonthKey);
    const ratio = habit.goal ? clamp((done / habit.goal) * 100, 0, 100) : 0;
    const cells = [`<td class='habit-name'>${escapeHtml(habit.name)}</td>`, `<td class='goal-col'>${habit.goal}</td>`];
    days.forEach((date) => {
      cells.push(`<td class='check-col'><input type='checkbox' data-habit-id='${habit.id}' data-date='${date}' ${habit.logs[date] ? "checked" : ""}></td>`);
    });
    cells.push(`<td class='exec-col'><strong>${done}/${habit.goal}</strong></td>`);
    cells.push(`<td class='progress-col'><div class='progress'><div style='width:${ratio}%'></div></div></td>`);
    cells.push(`<td class='action-col'><button class='btn ghost' type='button' data-habit-edit='${habit.id}'>Editar</button> <button class='btn danger' type='button' data-habit-delete='${habit.id}'>Excluir</button></td>`);
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
    openHabitEditModal(editBtn.dataset.habitEdit);
    return;
  }

  if (deleteBtn) {
    const habit = state.habits.find((h) => h.id === deleteBtn.dataset.habitDelete);
    if (!habit) return;
    openConfirmModal('Excluir hábito "' + habit.name + '"?', () => {
      state.habits = state.habits.filter((h) => h.id !== deleteBtn.dataset.habitDelete);
      persistAndRender();
    });
  }
}

function renderHabitChart() {
  const palette = getChartPalette();
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
        borderColor: palette.habitLine,
        backgroundColor: palette.habitFill,
        fill: true,
        tension: 0
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
  const palette = getChartPalette();
  const series = healthSeriesByPeriod(state.ui.healthPeriod);
  const goals = state.healthGoals;
  drawOrUpdateChart("health", refs.healthChart, {
    type: "line",
    data: {
      labels: series.labels,
      datasets: [
        { label: "Kcal", data: series.kcal, borderColor: palette.kcal, yAxisID: "y", fill: false, tension: 0 },
        { label: "Meta Kcal", data: series.kcal.map(() => goals.kcal || null), borderColor: palette.kcal, borderDash: [5, 5], yAxisID: "y", fill: false, tension: 0 },
        { label: "Sono", data: series.sleep, borderColor: palette.sleep, yAxisID: "y1", fill: false, tension: 0 },
        { label: "Meta Sono", data: series.sleep.map(() => goals.sleep || null), borderColor: palette.sleep, borderDash: [5, 5], yAxisID: "y1", fill: false, tension: 0 },
        { label: "Água", data: series.water, borderColor: palette.water, yAxisID: "y1", fill: false, tension: 0 },
        { label: "Meta Água", data: series.water.map(() => goals.water || null), borderColor: palette.water, borderDash: [5, 5], yAxisID: "y1", fill: false, tension: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { position: "left", min: 0, grid: { color: palette.gridStrong } },
        y1: { position: "right", min: 0, max: Math.max(12, goals.sleep + 2 || 10, goals.water + 2 || 8), grid: { drawOnChartArea: false } },
        x: { grid: { color: palette.gridSoft } }
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

  refs.finTotalIncome.textContent = formatSignedCurrency(income, "income");
  refs.finTotalIncome.className = "money-in";
  refs.finTotalExpense.textContent = formatSignedCurrency(expense, "expense");
  refs.finTotalExpense.className = "money-out";
  refs.finTotalBalance.textContent = formatSignedCurrency(balance, balance < 0 ? "expense" : "income");
  refs.finTotalBalance.className = balance < 0 ? "money-out" : "money-in";

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

  openConfirmModal('Registrar movimentação de ' + formatCurrency(tx.amount) + ' em ' + tx.category + '?', () => {
    state.transactions.push(tx);
    refs.txForm.reset();
    refs.txDate.value = todayKey;
    refs.txType.value = "income";
    hydrateCategorySelects();
    persistAndRender();
  });
}

function onBudgetSubmit(event) {
  event.preventDefault();
  const area = refs.budgetArea.value.trim();
  const planned = Number(refs.budgetPlanned.value);
  if (!area || planned <= 0) return;

  openConfirmModal('Salvar orçamento da área "' + area + '" em ' + formatCurrency(planned) + '?', () => {
    const existing = state.budgets.find((b) => normalize(b.area) === normalize(area));
    if (existing) {
      existing.area = area;
      existing.planned = planned;
    } else {
      state.budgets.push({ id: crypto.randomUUID(), area, planned });
    }
    refs.budgetForm.reset();
    persistAndRender();
  });
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

  openConfirmModal('Adicionar conta mensal "' + bill.name + '" (' + formatCurrency(bill.amount) + ')?', () => {
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
  });
}
function onBudgetActionClick(event) {
  const editBtn = event.target.closest("button[data-budget-edit]");
  const delBtn = event.target.closest("button[data-budget-delete]");

  if (editBtn) {
    openBudgetEditModal(editBtn.dataset.budgetEdit);
    return;
  }

  if (delBtn) {
    const item = state.budgets.find((b) => b.id === delBtn.dataset.budgetDelete);
    if (!item) return;
    openConfirmModal('Excluir orçamento da área "' + item.area + '"?', () => {
      state.budgets = state.budgets.filter((b) => b.id !== delBtn.dataset.budgetDelete);
      persistAndRender();
    });
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
      openConfirmModal('Desfazer pagamento da conta "' + bill.name + '" em ' + labelMonth(monthKey) + '?', () => {
        if (paidInfo.txId) state.transactions = state.transactions.filter((tx) => tx.id !== paidInfo.txId);
        delete bill.paid[monthKey];
        persistAndRender();
      });
    } else {
      const version = billVersionForMonth(bill, monthKey);
      openConfirmModal('Marcar "' + version.name + '" como paga e lançar saída de ' + formatCurrency(version.amount) + '?', () => {
        const due = String(clamp(version.dueDay, 1, 31)).padStart(2, "0");
        const tx = {
          id: crypto.randomUUID(),
          date: monthKey + '-' + due,
          type: "expense",
          category: version.category,
          amount: version.amount,
          note: 'Pagamento da conta: ' + version.name
        };
        state.transactions.push(tx);
        bill.paid[monthKey] = { paidDate: todayKey, txId: tx.id };
        persistAndRender();
      });
    }
    return;
  }

  if (editBtn) {
    openBillEditModal(editBtn.dataset.billEdit, monthKey);
    return;
  }

  if (delBtn) {
    const id = delBtn.dataset.billDelete;
    const bill = state.bills.find((b) => b.id === id);
    if (!bill) return;

    openConfirmModal('Excluir conta mensal "' + bill.name + '" e pagamentos vinculados?', () => {
      Object.values(bill.paid || {}).forEach((entry) => {
        if (entry.txId) state.transactions = state.transactions.filter((tx) => tx.id !== entry.txId);
      });
      state.bills = state.bills.filter((b) => b.id !== id);
      persistAndRender();
    });
  }
}

function onTxActionClick(event) {
  const editBtn = event.target.closest("button[data-tx-edit]");
  const delBtn = event.target.closest("button[data-tx-delete]");
  if (editBtn) {
    openTxEditModal(editBtn.dataset.txEdit);
    return;
  }
  if (delBtn) {
    const tx = state.transactions.find((t) => t.id === delBtn.dataset.txDelete);
    if (!tx) return;
    openConfirmModal('Excluir movimentação de ' + formatCurrency(tx.amount) + ' em ' + tx.category + '?', () => {
      state.transactions = state.transactions.filter((t) => t.id !== delBtn.dataset.txDelete);
      persistAndRender();
    });
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
    <div class="list-item"><span>Entradas</span><strong class="money-in">${formatSignedCurrency(income, "income")}</strong></div>
    <div class="list-item"><span>Saídas</span><strong class="money-out">${formatSignedCurrency(expense, "expense")}</strong></div>
    <div class="list-item"><span>Investimentos</span><strong class="money-out">${formatSignedCurrency(investment, "expense")}</strong></div>
    <div class="list-item"><span>Saldo atual</span><strong class="${balance < 0 ? "money-out" : "money-in"}">${formatSignedCurrency(balance, balance < 0 ? "expense" : "income")}</strong></div>
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
      <td class="${tx.type === "income" ? "money-in" : "money-out"}">${formatSignedCurrency(tx.amount, tx.type)}</td>
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
  const palette = getChartPalette();
  const labels = entries.map(([label]) => label);
  const values = entries.map(([, value]) => value);
  const total = values.reduce((sum, value) => sum + value, 0);
  drawOrUpdateChart(chartKey, canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: palette.pieBorder,
        borderWidth: 1,
        backgroundColor: palette.pie
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
  const palette = getChartPalette();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: !hideLegend } },
    scales: {
      y: { min, max, grid: { color: palette.gridStrong } },
      x: { grid: { color: palette.gridSoft } }
    }
  };
}

function getChartPalette() {
  const mode = getResolvedThemeMode(state.settings.themeMode);
  const accent = normalizeThemeAccent(state.settings.themeAccent);
  const preset = THEME_PRESETS[accent]?.[mode] || THEME_PRESETS.neutral[mode];

  return {
    ...preset.chart,
    gridStrong: mode === "dark" ? "rgba(112,126,148,0.26)" : "rgba(125,136,153,0.2)",
    gridSoft: mode === "dark" ? "rgba(112,126,148,0.2)" : "rgba(125,136,153,0.15)"
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
  openConfirmModal("Excluir todos os dados locais da conta?", () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    location.reload();
  });
}

function sumByType(transactions, type) {
  return transactions.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0);
}

function labelTxType(type) {
  if (type === "income") return "Entrada";
  if (type === "expense") return "Saída";
  return "Investimento";
}

function findHabitByName(name) {
  const key = normalize(name);
  const exact = state.habits.find((h) => normalize(h.name) === key);
  if (exact) return exact;

  // fallback: permite "jiu" casar com "Jiu-Jitsu"
  const partial = state.habits.find((h) => {
    const n = normalize(h.name);
    return n.includes(key) || key.includes(n);
  });
  return partial || null;
}
function markHabitByDate(name, dateKey = todayKey) {
  let habit = findHabitByName(name);
  if (!habit) {
    habit = { id: crypto.randomUUID(), name, goal: 20, logs: {} };
    state.habits.push(habit);
  }
  habit.logs[dateKey] = true;
}

function unmarkHabitByDate(name, dateKey = todayKey) {
  const habit = findHabitByName(name);
  if (!habit) return false;
  if (!habit.logs?.[dateKey]) return false;
  delete habit.logs[dateKey];
  return true;
}

function markHabitToday(name) {
  markHabitByDate(name, todayKey);
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

function formatSignedCurrency(value, type = "income") {
  const amount = Math.abs(Number(value || 0));
  const signed = type === "expense" || type === "investment" ? -amount : amount;
  const prefix = signed < 0 ? "-" : "+";
  return `${prefix}${formatCurrency(Math.abs(signed))}`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeThemeMode(mode) {
  return THEME_MODES.includes(mode) ? mode : "system";
}

function normalizeThemeAccent(accent) {
  return THEME_ACCENTS.includes(accent) ? accent : "neutral";
}

function normalizeThemeSettings(settings) {
  const safe = settings && typeof settings === "object" ? settings : {};
  let themeMode = normalizeThemeMode(safe.themeMode);
  let themeAccent = normalizeThemeAccent(safe.themeAccent);

  if ((!safe.themeMode || !safe.themeAccent) && safe.theme && LEGACY_THEME_MAP[safe.theme]) {
    themeMode = LEGACY_THEME_MAP[safe.theme].themeMode;
    themeAccent = LEGACY_THEME_MAP[safe.theme].themeAccent;
  }

  return {
    ...safe,
    themeMode,
    themeAccent
  };
}

function getResolvedThemeMode(mode) {
  const normalizedMode = normalizeThemeMode(mode);
  if (normalizedMode === "system") {
    return systemThemeQuery.matches ? "dark" : "light";
  }
  return normalizedMode;
}

function getActiveThemePreset(mode = state.settings.themeMode, accent = state.settings.themeAccent) {
  const resolvedMode = getResolvedThemeMode(mode);
  const normalizedAccent = normalizeThemeAccent(accent);
  const preset = THEME_PRESETS[normalizedAccent]?.[resolvedMode] || THEME_PRESETS.neutral[resolvedMode];
  return { preset, resolvedMode, normalizedAccent };
}

function applyTheme() {
  const { preset, resolvedMode, normalizedAccent } = getActiveThemePreset();
  const selectedMode = normalizeThemeMode(state.settings.themeMode);
  document.body.classList.remove(
    "theme-light",
    "theme-dark",
    "theme-pastel-pink",
    "theme-pastel-green",
    "theme-pastel-blue",
    "theme-pastel-purple",
    "theme-black-red"
  );
  document.body.classList.add(`theme-${resolvedMode}`);
  document.body.dataset.themeMode = selectedMode;
  document.body.dataset.themeResolved = resolvedMode;
  document.body.dataset.themeAccent = normalizedAccent;
  document.body.style.setProperty("--accent", preset.accent);
  document.body.style.setProperty("--accent-contrast", preset.contrast);
  document.body.style.setProperty("--check-accent", preset.check);
  document.body.style.setProperty("--money-in-color", preset.moneyIn);
  document.body.style.setProperty("--money-out-color", preset.moneyOut);
  refs.themeToggleBtn.textContent = selectedMode === "system"
    ? "Tema: Sistema"
    : selectedMode === "dark"
      ? "Tema: Escuro"
      : "Tema: Claro";
}

function openHabitEditModal(habitId) {
  const habit = state.habits.find((h) => h.id === habitId);
  if (!habit) return;
  editingHabitId = habit.id;
  refs.habitEditName.value = habit.name;
  refs.habitEditGoal.value = String(habit.goal);
  refs.habitEditModal.classList.remove("hidden");
}

function closeHabitEditModal() {
  editingHabitId = "";
  refs.habitEditModal.classList.add("hidden");
}

function onHabitEditSubmit(event) {
  event.preventDefault();
  const habit = state.habits.find((h) => h.id === editingHabitId);
  if (!habit) return;
  const name = refs.habitEditName.value.trim();
  const goal = Number(refs.habitEditGoal.value);
  if (!name || goal < 1) return;
  habit.name = name;
  habit.goal = goal;
  closeHabitEditModal();
  persistAndRender();
}

function hydrateTxEditCategorySelect() {
  const type = refs.txEditType.value;
  const categories = CATEGORY_BY_TYPE[type] || CATEGORY_BY_TYPE.expense;
  const current = refs.txEditCategory.dataset.current || "";
  refs.txEditCategory.innerHTML = categories.map((item) => `<option value="${item}">${item}</option>`).join("");
  refs.txEditCategory.value = categories.includes(current) ? current : categories[0];
}

function openTxEditModal(txId) {
  const tx = state.transactions.find((t) => t.id === txId);
  if (!tx) return;
  editingTxId = tx.id;
  refs.txEditDate.value = tx.date;
  refs.txEditType.value = tx.type;
  refs.txEditCategory.dataset.current = tx.category;
  hydrateTxEditCategorySelect();
  refs.txEditAmount.value = String(tx.amount);
  refs.txEditNote.value = tx.note || "";
  refs.txEditModal.classList.remove("hidden");
}

function closeTxEditModal() {
  editingTxId = "";
  refs.txEditModal.classList.add("hidden");
}

function onTxEditSubmit(event) {
  event.preventDefault();
  const tx = state.transactions.find((t) => t.id === editingTxId);
  if (!tx) return;
  const date = refs.txEditDate.value;
  const type = refs.txEditType.value;
  const category = refs.txEditCategory.value;
  const amount = Number(refs.txEditAmount.value);
  const note = refs.txEditNote.value.trim();
  if (!date || !["income", "expense", "investment"].includes(type) || !category || amount <= 0) return;
  tx.date = date;
  tx.type = type;
  tx.category = category;
  tx.amount = amount;
  tx.note = note;
  closeTxEditModal();
  persistAndRender();
}
function openBudgetEditModal(budgetId) {
  const budget = state.budgets.find((b) => b.id === budgetId);
  if (!budget) return;
  editingBudgetId = budget.id;
  refs.budgetEditArea.value = budget.area;
  refs.budgetEditPlanned.value = String(budget.planned);
  refs.budgetEditModal.classList.remove("hidden");
}

function closeBudgetEditModal() {
  editingBudgetId = "";
  refs.budgetEditModal.classList.add("hidden");
}

function onBudgetEditSubmit(event) {
  event.preventDefault();
  const budget = state.budgets.find((b) => b.id === editingBudgetId);
  if (!budget) return;
  const area = refs.budgetEditArea.value.trim();
  const planned = Number(refs.budgetEditPlanned.value);
  if (!area || planned <= 0) return;
  budget.area = area;
  budget.planned = planned;
  closeBudgetEditModal();
  persistAndRender();
}

function openBillEditModal(billId, monthKey = financeBillMonthKey()) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return;
  const current = billVersionForMonth(bill, monthKey);
  editingBillId = bill.id + '::' + monthKey;
  refs.billEditName.value = current.name;
  refs.billEditCategory.innerHTML = CATEGORY_BY_TYPE.expense.map((c) => '<option value="' + c + '">' + c + '</option>').join('');
  refs.billEditCategory.value = CATEGORY_BY_TYPE.expense.includes(current.category) ? current.category : "Outros";
  refs.billEditAmount.value = String(current.amount);
  refs.billEditDueDay.value = String(current.dueDay);
  refs.billEditModal.classList.remove("hidden");
}

function closeBillEditModal() {
  editingBillId = "";
  refs.billEditModal.classList.add("hidden");
}

function onBillEditSubmit(event) {
  event.preventDefault();
  const parts = String(editingBillId || '').split('::');
  const billId = parts[0] || '';
  const monthKey = parts[1] || financeBillMonthKey();
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return;

  const name = refs.billEditName.value.trim();
  const category = refs.billEditCategory.value;
  const amount = Number(refs.billEditAmount.value);
  const dueDay = Number(refs.billEditDueDay.value);
  if (!name || !category || amount <= 0 || dueDay < 1 || dueDay > 31) return;

  upsertBillVersion(bill, monthKey, { name, category, amount, dueDay });
  closeBillEditModal();
  persistAndRender();
}

function openConfirmModal(message, onConfirm) {
  refs.confirmMessage.textContent = message;
  confirmActionHandler = typeof onConfirm === "function" ? onConfirm : null;
  refs.confirmModal.classList.remove("hidden");
}

function closeConfirmModal() {
  confirmActionHandler = null;
  confirmBusy = false;
  refs.confirmOkBtn.disabled = false;
  refs.confirmOkBtn.textContent = "Confirmar";
  refs.confirmModal.classList.add("hidden");
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
      themeMode: "system",
      themeAccent: "neutral"
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
      settings: normalizeThemeSettings({ ...base.settings, ...(parsed.settings || {}) }),
      ui: { ...base.ui, ...(parsed.ui || {}) },
      healthGoals: { ...base.healthGoals, ...(parsed.healthGoals || {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks.map((task) => ({
        ...task,
        sortOrder: Number(task?.sortOrder || 0)
      })) : [],
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
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const token = String(parsed.token || "").trim();
    if (!token) return null;
    return {
      token,
      user: parsed.user && typeof parsed.user === "object" ? parsed.user : null
    };
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
  if (!authToken || !currentStateOwnerId) return;
  clearTimeout(saveTimer);
  const ownerAtSchedule = currentStateOwnerId;
  saveTimer = setTimeout(async () => {
    if (!authToken || ownerAtSchedule !== currentStateOwnerId) return;
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
  if (!authToken || !currentStateOwnerId) return;
  try {
    const data = await apiRequest("/api/state");
    if (!data?.state || typeof data.state !== "object") {
      hydrateStateFromRemote(defaultState());
      return;
    }
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
    settings: normalizeThemeSettings({ ...base.settings, ...(remote.settings || {}) }),
    ui: { ...state.ui, ...(remote.ui || {}) },
    healthGoals: { ...base.healthGoals, ...(remote.healthGoals || {}) },
    tasks: Array.isArray(remote.tasks) ? remote.tasks.map((task) => ({
      ...task,
      sortOrder: Number(task?.sortOrder || 0)
    })) : [],
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
  syncThemeControlsFromState();
  applyTheme();
}

async function apiRequest(endpoint, options = {}, requireAuth = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (requireAuth && authToken) headers.Authorization = `Bearer ${authToken}`;
  let res;
  try {
    res = await fetch(`${apiBase}${endpoint}`, { ...options, headers });
  } catch (error) {
    const networkError = new Error(`Falha de conexão com ${apiBase}`);
    networkError.status = 0;
    networkError.cause = error;
    throw networkError;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const apiError = new Error(data?.error || `Erro HTTP ${res.status}`);
    apiError.status = res.status;
    apiError.payload = data;
    throw apiError;
  }
  return data;
}
























