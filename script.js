const dom = {
  input: document.querySelector("#card-input"),
  guessButton: document.querySelector("#guess-button"),
  restartButton: document.querySelector("#restart-button"),
  giveUpButton: document.querySelector("#give-up-button"),
  playAgainButton: document.querySelector("#play-again-button"),
  suggestions: document.querySelector("#suggestions"),
  statusMessage: document.querySelector("#status-message"),
  guessHistory: document.querySelector("#guess-history"),
  emptyState: document.querySelector("#empty-state"),
  poolSize: document.querySelector("#pool-size"),
  guessCount: document.querySelector("#guess-count"),
  winBanner: document.querySelector("#win-banner"),
  resultLabel: document.querySelector("#result-label"),
  resultTitle: document.querySelector("#result-title"),
  winMessage: document.querySelector("#win-message"),
  winCardImage: document.querySelector("#win-card-image"),
  suggestionPreview: document.querySelector("#suggestion-preview"),
  suggestionPreviewImage: document.querySelector("#suggestion-preview-image"),
  localeSelect: document.querySelector("#locale-select"),
  snapshotSelect: document.querySelector("#snapshot-select"),
  snapshotDescription: document.querySelector("#snapshot-description"),
  filterClass: document.querySelector("#filter-class"),
  filterType: document.querySelector("#filter-type"),
  filterMana: document.querySelector("#filter-mana"),
  filterSeries: document.querySelector("#filter-series"),
  modeSelect: document.querySelector("#mode-select"),
  clearFilters: document.querySelector("#clear-filters"),
  toast: document.querySelector("#toast"),
  hintButton: document.querySelector("#hint-button"),
  hintList: document.querySelector("#hint-list"),
  modeLabel: document.querySelector("#mode-label"),
};

let normalizedCards = [];
let snapshotManifest = null;

const i18n = {
  zh: {
    pageTitle: "炉石猜卡",
    eyebrow: "炉石传说 · 猜卡挑战",
    rulesTitle: "规则",
    rules: [
      "输入一张卡牌名称并提交竞猜。",
      "系统会比对职业、稀有度、法力值、类型、所属系列、关键词。",
      "当你确认答案是随从后，会额外显示种族列；确认答案是法术后，会额外显示派系列。",
      "绿色表示命中；错误属性会显示为红色；法力值会给出 ↑ / ↓ 提示。"
    ],
    allSnapshots: "加载版本中...",
    allClass: "全部职业",
    allType: "全部类型",
    allMana: "全部费用",
    allSeries: "全部系列",
    modeEasy: "简单模式",
    modeMedium: "中等模式",
    modeHard: "困难模式",
    clearFilters: "清空筛选",
    inputPlaceholder: "例如：炎枪术 / 火球术 / 寒冬号角",
    guess: "竞猜",
    hint: "获取提示",
    mode: "模式",
    pool: "题库",
    guesses: "已猜",
    giveUp: "放弃看答案",
    restart: "重新开局",
    history: "竞猜记录",
    legendCorrect: "命中",
    legendWrong: "未命中",
    legendMana: "法力方向提示",
    empty: "还没有竞猜，先来试一张卡牌。",
    resultWin: "胜利",
    resultWinTitle: "你猜中了！",
    resultLose: "失败",
    resultLoseTitle: "你已放弃。",
    playAgain: "再来一局",
    table: ["卡牌", "职业", "稀有度", "法力值", "类型", "所属系列", "关键词"],
    tribe: "种族",
    spellSchool: "派系",
    statusNeedInput: "请输入卡牌名称后再提交。",
    statusNotFound: "题库中没有这张卡牌，请从建议中选择或输入精确名称。",
    statusDuplicate: "这张卡已经猜过了，换一张试试。",
    statusSolved: "全部字段命中，游戏结束。",
    statusSubmitted: "已提交：",
    statusGiveUp: "已放弃：答案是 ",
    statusHintsDone: "这张牌的效果提示已经全部解锁。",
    hintPrefix: "提示：这张牌",
    toastTribe: "已确认答案是随从，解锁“种族”线索",
    toastSchool: "已确认答案是法术，解锁“派系”线索",
    answerMessage: (name, count) => `答案是 ${name}，你用了 ${count} 次竞猜。`,
    giveUpMessage: (name) => `你已放弃，本局答案是 ${name}。`,
    loadingError: (status) => `加载快照卡牌数据失败：${status}`,
    manifestError: (status) => `加载快照清单失败：${status}`,
    unknown: "未知",
    none: "无",
    multiClass: "多职业",
    miniSuffix: "（迷你包）",
    manaUnit: "费",
    previewAlt: (name) => `${name} 预览图`,
    artAlt: (name) => `${name} 卡牌插图`,
    poolLabel: "题库",
    guessesLabel: "已猜",
    defaultHint: "这张牌有独特效果",
    hintTags: {
      "抽牌": "抽牌", "回血": "回血", "伤害": "伤害", "护甲": "增加护甲", "召唤": "召唤", "发现": "发现", "变形": "变形", "冻结": "冻结",
      "复活": "复活", "沉默": "沉默", "复制": "复制", "弃牌": "弃牌", "法力加速": "法力加速", "武器互动": "和武器有关", "奥秘互动": "和奥秘有关",
      "亡语互动": "和亡语有关", "战吼互动": "和战吼有关", "随从增益": "和随从增益有关", "过载": "和过载有关", "灌注": "和灌注有关", "锻造": "和锻造有关",
      "探底": "和探底有关", "任务": "和任务有关", "偷牌": "和偷牌有关", "控制": "和控制对手随从有关", "随机效果": "和随机效果有关", "减费": "和减费有关",
      "增费": "和增费有关", "回手": "和回手有关", "铺场": "和铺场有关", "解场": "和解场有关", "buff": "和强化有关", "debuff": "和削弱有关",
      "法术派系": "和法术派系有关", "种族协同": "和种族协同有关", "法术伤害": "和法术伤害有关", "防守": "和防守有关", "站场": "和站场有关", "多次攻击": "和多次攻击有关"
    }
  },
  en: {
    pageTitle: "Hearthstone Card Guess",
    eyebrow: "Hearthstone · Card Guess",
    rulesTitle: "Rules",
    rules: [
      "Enter a card name and submit your guess.",
      "The game compares class, rarity, mana cost, type, series, and keywords.",
      "Once minion is confirmed, a tribe column appears; once spell is confirmed, a spell school column appears.",
      "Green means match, red means miss, and mana shows ↑ / ↓ guidance."
    ],
    allSnapshots: "Loading snapshots...",
    allClass: "All classes",
    allType: "All types",
    allMana: "All mana",
    allSeries: "All series",
    modeEasy: "Easy Mode",
    modeMedium: "Medium Mode",
    modeHard: "Hard Mode",
    clearFilters: "Clear filters",
    inputPlaceholder: "Example: Fireball / Frost Strike / Arcane Missiles",
    guess: "Guess",
    hint: "Get hint",
    mode: "Mode",
    pool: "Pool",
    guesses: "Guesses",
    giveUp: "Give up",
    restart: "Restart",
    history: "Guess History",
    legendCorrect: "Match",
    legendWrong: "Miss",
    legendMana: "Mana hint",
    empty: "No guesses yet. Start with a card.",
    resultWin: "Victory",
    resultWinTitle: "You got it!",
    resultLose: "Failed",
    resultLoseTitle: "You gave up.",
    playAgain: "Play again",
    table: ["Card", "Class", "Rarity", "Mana", "Type", "Series", "Keywords"],
    tribe: "Tribe",
    spellSchool: "School",
    statusNeedInput: "Enter a card name before submitting.",
    statusNotFound: "That card is not in the pool. Pick from suggestions or enter the exact name.",
    statusDuplicate: "You already guessed that card.",
    statusSolved: "All fields matched. Game over.",
    statusSubmitted: "Submitted: ",
    statusGiveUp: "You gave up. The answer is ",
    statusHintsDone: "All effect hints for this card are already revealed.",
    hintPrefix: "Hint: this card is related to ",
    toastTribe: "Minion confirmed. Tribe clue unlocked.",
    toastSchool: "Spell confirmed. School clue unlocked.",
    answerMessage: (name, count) => `The answer is ${name}. You used ${count} guesses.`,
    giveUpMessage: (name) => `You gave up. The answer was ${name}.`,
    loadingError: (status) => `Failed to load snapshot cards: ${status}`,
    manifestError: (status) => `Failed to load snapshot manifest: ${status}`,
    unknown: "Unknown",
    none: "None",
    multiClass: "Multi-class",
    miniSuffix: " (Mini-set)",
    manaUnit: " mana",
    previewAlt: (name) => `${name} preview art`,
    artAlt: (name) => `${name} card art`,
    poolLabel: "Pool",
    guessesLabel: "Guessed",
    defaultHint: "has a unique effect",
    hintTags: {
      "抽牌": "draw", "回血": "healing", "伤害": "damage", "护甲": "armor gain", "召唤": "summoning", "发现": "discover", "变形": "transform", "冻结": "freeze",
      "复活": "resurrection", "沉默": "silence", "复制": "copying", "弃牌": "discard", "法力加速": "mana ramp", "武器互动": "weapon synergy", "奥秘互动": "secret synergy",
      "亡语互动": "deathrattle synergy", "战吼互动": "battlecry synergy", "随从增益": "minion buffs", "过载": "overload", "灌注": "infuse", "锻造": "forge",
      "探底": "dredge", "任务": "quests", "偷牌": "stealing cards", "控制": "control effects", "随机效果": "random effects", "减费": "cost reduction",
      "增费": "cost increase", "回手": "bounce", "铺场": "board flooding", "解场": "removal", "buff": "buffs", "debuff": "debuffs",
      "法术派系": "spell schools", "种族协同": "tribal synergy", "法术伤害": "spell damage", "防守": "defense", "站场": "sticking on board", "多次攻击": "multiple attacks"
    }
  }
};

const localizedMaps = {
  zh: {
    class: {
      DEATHKNIGHT: "死亡骑士", DEMONHUNTER: "恶魔猎手", DRUID: "德鲁伊", HUNTER: "猎人", MAGE: "法师", NEUTRAL: "中立", PALADIN: "圣骑士", PRIEST: "牧师", ROGUE: "潜行者", SHAMAN: "萨满祭司", WARLOCK: "术士", WARRIOR: "战士",
    },
    rarity: { FREE: "免费", COMMON: "普通", RARE: "稀有", EPIC: "史诗", LEGENDARY: "传说" },
    type: { MINION: "随从", SPELL: "法术", WEAPON: "武器", LOCATION: "地标", HERO: "英雄" },
    school: { ARCANE: "奥术", FEL: "邪能", FIRE: "火焰", FROST: "冰霜", HOLY: "神圣", NATURE: "自然", SHADOW: "暗影" },
    tribe: { BEAST: "野兽", DEMON: "恶魔", DRAGON: "龙", DRAENEI: "德莱尼", ELEMENTAL: "元素", MECH: "机械", MURLOC: "鱼人", NAGA: "纳迦", PIRATE: "海盗", QUILBOAR: "野猪人", TOTEM: "图腾", UNDEAD: "亡灵", ZERG: "异虫" },
    keyword: { AURA: "光环", BATTLECRY: "战吼", CHARGE: "冲锋", COLOSSAL: "巨型", DEATHRATTLE: "亡语", DISCOVER: "发现", DIVINE_SHIELD: "圣盾", DREDGE: "探底", ECHO: "回响", FORGE: "锻造", FREEZE: "冻结", FRENZY: "暴怒", INFUSE: "灌注", LIFESTEAL: "吸血", MEGA_WINDFURY: "超级风怒", OUTCAST: "流放", OVERLOAD: "过载", POISONOUS: "剧毒", QUEST: "任务", QUESTLINE: "任务线", REBORN: "复生", RUSH: "突袭", SECRET: "奥秘", SPELLPOWER: "法术伤害", STEALTH: "潜行", TAUNT: "嘲讽", TITAN: "泰坦", WINDFURY: "风怒" },
    expansion: {
      CORE: "核心",
      EXPERT1: "经典",
      LEGACY: "传承",
      CATACLYSM: "浩劫与重生",
      WHIZBANGS_WORKSHOP: "威兹班的工坊",
      ISLAND_VACATION: "胜地历险记",
      SPACE: "深暗领域",
      EMERALD_DREAM: "漫游翡翠梦境",
      THE_LOST_CITY: "安戈洛龟途",
      TIME_TRAVEL: "穿越时间流"
    }
  },
  en: {
    class: { DEATHKNIGHT: "Death Knight", DEMONHUNTER: "Demon Hunter", DRUID: "Druid", HUNTER: "Hunter", MAGE: "Mage", NEUTRAL: "Neutral", PALADIN: "Paladin", PRIEST: "Priest", ROGUE: "Rogue", SHAMAN: "Shaman", WARLOCK: "Warlock", WARRIOR: "Warrior" },
    rarity: { FREE: "Free", COMMON: "Common", RARE: "Rare", EPIC: "Epic", LEGENDARY: "Legendary" },
    type: { MINION: "Minion", SPELL: "Spell", WEAPON: "Weapon", LOCATION: "Location", HERO: "Hero" },
    school: { ARCANE: "Arcane", FEL: "Fel", FIRE: "Fire", FROST: "Frost", HOLY: "Holy", NATURE: "Nature", SHADOW: "Shadow" },
    tribe: { BEAST: "Beast", DEMON: "Demon", DRAGON: "Dragon", DRAENEI: "Draenei", ELEMENTAL: "Elemental", MECH: "Mech", MURLOC: "Murloc", NAGA: "Naga", PIRATE: "Pirate", QUILBOAR: "Quilboar", TOTEM: "Totem", UNDEAD: "Undead", ZERG: "Zerg" },
    keyword: { AURA: "Aura", BATTLECRY: "Battlecry", CHARGE: "Charge", COLOSSAL: "Colossal", DEATHRATTLE: "Deathrattle", DISCOVER: "Discover", DIVINE_SHIELD: "Divine Shield", DREDGE: "Dredge", ECHO: "Echo", FORGE: "Forge", FREEZE: "Freeze", FRENZY: "Frenzy", INFUSE: "Infuse", LIFESTEAL: "Lifesteal", MEGA_WINDFURY: "Mega-Windfury", OUTCAST: "Outcast", OVERLOAD: "Overload", POISONOUS: "Poisonous", QUEST: "Quest", QUESTLINE: "Questline", REBORN: "Reborn", RUSH: "Rush", SECRET: "Secret", SPELLPOWER: "Spell Damage", STEALTH: "Stealth", TAUNT: "Taunt", TITAN: "Titan", WINDFURY: "Windfury" },
    expansion: { CORE: "Core", EXPERT1: "Classic", LEGACY: "Legacy", CATACLYSM: "Cataclysm", WHIZBANGS_WORKSHOP: "Whizbang's Workshop", ISLAND_VACATION: "Perils in Paradise", SPACE: "The Great Dark Beyond", EMERALD_DREAM: "Into the Emerald Dream", THE_LOST_CITY: "The Lost City of Un'Goro", TIME_TRAVEL: "Across the Timeways" }
  }
};

const state = {
  answer: null,
  guesses: [],
  selectedSuggestionIndex: -1,
  filteredSuggestions: [],
  finished: false,
  filters: {
    class: "",
    type: "",
    mana: "",
    series: "",
  },
  unlockedHints: {
    tribe: false,
    spellSchool: false,
  },
  mode: "easy",
  revealedHints: [],
  snapshotKey: null,
  locale: "zh",
  toastTimer: null,
};

const modeLabels = {
  easy: () => (state.locale === 'zh' ? '简单' : 'Easy'),
  medium: () => (state.locale === 'zh' ? '中等' : 'Medium'),
  hard: () => (state.locale === 'zh' ? '困难' : 'Hard'),
};

function normalize(value) {
  return value.trim().toLowerCase().replace(/['’:]/g, "").replace(/\s+/g, " ");
}

function getCardImageUrl(card, size = "256x") {
  const imageLocale = state.locale === 'en' ? 'enUS' : 'zhCN';
  return `https://art.hearthstonejson.com/v1/render/latest/${imageLocale}/${size}/${card.id}.png`;
}

function showSuggestionPreview(card) {
  dom.suggestionPreviewImage.src = getCardImageUrl(card, "512x");
  dom.suggestionPreviewImage.alt = t('previewAlt')(card.name);
  dom.suggestionPreview.classList.remove("hidden");
  dom.suggestionPreview.setAttribute("aria-hidden", "false");
}

function showToast(message) {
  clearTimeout(state.toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.remove("hidden");
  state.toastTimer = window.setTimeout(() => {
    dom.toast.classList.add("hidden");
  }, 2400);
}

function t(key) {
  return i18n[state.locale][key];
}

function applyLocale() {
  document.documentElement.lang = state.locale === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  document.querySelector(".eyebrow").textContent = t("eyebrow");
  document.querySelector("h1").textContent = t("pageTitle");
  document.querySelector(".instructions h2").textContent = t("rulesTitle");
  document.querySelectorAll(".instructions li").forEach((li, index) => {
    li.textContent = t("rules")[index];
  });
  dom.input.placeholder = t("inputPlaceholder");
  dom.guessButton.textContent = t("guess");
  dom.hintButton.textContent = t("hint");
  dom.clearFilters.textContent = t("clearFilters");
  dom.giveUpButton.textContent = t("giveUp");
  dom.restartButton.textContent = t("restart");
  dom.playAgainButton.textContent = t("playAgain");
  document.querySelector('.history h2').textContent = t('history');
  const legendSpans = document.querySelectorAll('.legend span');
  legendSpans[0].innerHTML = '<i class="legend-chip correct"></i> ' + t('legendCorrect');
  legendSpans[1].innerHTML = '<i class="legend-chip wrong"></i> ' + t('legendWrong');
  legendSpans[2].innerHTML = '<i class="legend-chip mana"></i> ' + t('legendMana');
  dom.emptyState.textContent = t('empty');
  dom.resultLabel.textContent = dom.winBanner.classList.contains('failed') ? t('resultLose') : t('resultWin');
  dom.resultTitle.textContent = dom.winBanner.classList.contains('failed') ? t('resultLoseTitle') : t('resultWinTitle');
  dom.modeLabel.textContent = modeLabels[state.mode]();
  buildStaticSelectLabels();
  renderSnapshotOptions();
  updateTableHead(shouldShowTribeColumn(), shouldShowSpellSchoolColumn());
}

function buildStaticSelectLabels() {
  dom.snapshotSelect.setAttribute('aria-label', state.locale === 'zh' ? '版本快照' : 'Snapshot');
  dom.filterClass.options[0].textContent = t('allClass');
  dom.filterType.options[0].textContent = t('allType');
  dom.filterMana.options[0].textContent = t('allMana');
  dom.filterSeries.options[0].textContent = t('allSeries');
  dom.modeSelect.options[0].textContent = t('modeEasy');
  dom.modeSelect.options[1].textContent = t('modeMedium');
  dom.modeSelect.options[2].textContent = t('modeHard');
  const pillNodes = document.querySelectorAll('.pill');
  pillNodes[0].innerHTML = `${t('mode')}: <strong id="mode-label">${modeLabels[state.mode]()}</strong>`;
  pillNodes[1].innerHTML = `${t('poolLabel')}: <strong id="pool-size">${dom.poolSize.textContent}</strong> ${state.locale === 'zh' ? '张' : ''}`;
  pillNodes[2].innerHTML = `${t('guessesLabel')}: <strong id="guess-count">${dom.guessCount.textContent}</strong> ${state.locale === 'zh' ? '次' : ''}`;
  dom.modeLabel = document.querySelector('#mode-label');
  dom.poolSize = document.querySelector('#pool-size');
  dom.guessCount = document.querySelector('#guess-count');
}

function getClassFilterValue(card) {
  const classes = getCardClasses(card);
  return classes.length > 1 ? "MULTI" : classes[0] ?? "UNKNOWN";
}

function matchesFilters(card) {
  const { class: classFilter, type, mana, series } = state.filters;
  if (state.mode === "easy" && card.difficulty !== "easy") return false;
  if (state.mode === "medium" && !["easy", "medium"].includes(card.difficulty)) return false;
  if (classFilter && getClassFilterValue(card) !== classFilter) return false;
  if (type && card.type !== type) return false;
  if (mana && String(card.mana) !== mana) return false;
  if (series && card.seriesCode !== series) return false;
  return true;
}

function refreshSuggestions() {
  const suggestions = getSuggestions(dom.input.value);
  renderSuggestions(suggestions);
}

function getAvailableCardsForMode() {
  return normalizedCards.filter((card) => {
    if (state.mode === "easy") return card.difficulty === "easy";
    if (state.mode === "medium") return ["easy", "medium"].includes(card.difficulty);
    return true;
  });
}

function updatePoolSize() {
  dom.poolSize.textContent = String(getAvailableCardsForMode().length);
}

function buildFilterOptions() {
  dom.filterClass.innerHTML = `<option value="">${t('allClass')}</option>`;
  dom.filterType.innerHTML = `<option value="">${t('allType')}</option>`;
  dom.filterMana.innerHTML = `<option value="">${t('allMana')}</option>`;
  dom.filterSeries.innerHTML = `<option value="">${t('allSeries')}</option>`;
  const uniqueTypes = [...new Set(normalizedCards.map((card) => card.type))].sort();
  const uniqueMana = [...new Set(normalizedCards.map((card) => card.mana))].sort((a, b) => a - b);
  const uniqueSeries = [...new Map(normalizedCards.map((card) => [card.seriesCode, formatSeries(card)])).entries()];

  Object.entries({ MULTI: t('multiClass'), ...localizedMaps[state.locale].class }).forEach(([value, label]) => {
    if (![...dom.filterClass.options].some((option) => option.value === value)) {
      dom.filterClass.insertAdjacentHTML("beforeend", `<option value="${value}">${label}</option>`);
    }
  });

  uniqueTypes.forEach((value) => {
    dom.filterType.insertAdjacentHTML("beforeend", `<option value="${value}">${formatValue(value)}</option>`);
  });

  uniqueMana.forEach((value) => {
    dom.filterMana.insertAdjacentHTML("beforeend", `<option value="${value}">${value}${t('manaUnit')}</option>`);
  });

  uniqueSeries.forEach(([value, label]) => {
    dom.filterSeries.insertAdjacentHTML("beforeend", `<option value="${value}">${label}</option>`);
  });
}

function renderSnapshotOptions() {
  if (!snapshotManifest) return;
  dom.snapshotSelect.innerHTML = snapshotManifest.snapshots
    .map((snapshot) => `<option value="${snapshot.key}">${state.locale === 'zh' ? snapshot.label : (snapshot.labelEn || snapshot.label)}</option>`)
    .join("");
  dom.snapshotSelect.value = state.snapshotKey;
  const current = snapshotManifest.snapshots.find((item) => item.key === state.snapshotKey);
  dom.snapshotDescription.textContent = state.locale === 'zh'
    ? (current?.description ?? '标准模式卡牌快照')
    : (current?.descriptionEn ?? current?.description ?? 'Standard snapshot card pool');
}

async function loadSnapshot(snapshotKey) {
  const snapshot = snapshotManifest?.snapshots.find((item) => item.key === snapshotKey);
  if (!snapshot) {
    throw new Error(state.locale === 'zh' ? `未知快照：${snapshotKey}` : `Unknown snapshot: ${snapshotKey}`);
  }

  const cardsPath = state.locale === 'en' && snapshot.cardsPathEn ? snapshot.cardsPathEn : snapshot.cardsPath;
  const response = await fetch(cardsPath);
  if (!response.ok) {
    throw new Error(t('loadingError')(response.status));
  }

  const cards = await response.json();
  normalizedCards = cards.map((card) => ({
    ...card,
    normalizedName: normalize(card.name),
  }));
  state.snapshotKey = snapshotKey;
  renderSnapshotOptions();
  buildFilterOptions();
  resetGame();
}

function hideSuggestionPreview() {
  dom.suggestionPreview.classList.add("hidden");
  dom.suggestionPreview.setAttribute("aria-hidden", "true");
  dom.suggestionPreviewImage.removeAttribute("src");
}

function pickRandomAnswer() {
  return normalizedCards[Math.floor(Math.random() * normalizedCards.length)];
}

function resetGame() {
  const availableCards = getAvailableCardsForMode();
  if (!availableCards.length) {
    return;
  }
  state.answer = availableCards[Math.floor(Math.random() * availableCards.length)];
  state.guesses = [];
  state.selectedSuggestionIndex = -1;
  state.filteredSuggestions = [];
  state.finished = false;
  dom.input.value = "";
  dom.statusMessage.textContent = "";
  dom.guessHistory.innerHTML = "";
  dom.emptyState.classList.remove("hidden");
  dom.guessCount.textContent = "0";
  dom.winBanner.classList.add("hidden");
  dom.winBanner.classList.remove("failed");
  dom.resultLabel.textContent = "胜利";
  dom.resultTitle.textContent = "你猜中了！";
  dom.winCardImage.removeAttribute("src");
  state.revealedHints = [];
  dom.hintList.innerHTML = "";
  dom.modeLabel.textContent = modeLabels[state.mode];
  updatePoolSize();
  hideSuggestionPreview();
  state.unlockedHints.tribe = false;
  state.unlockedHints.spellSchool = false;
  renderSuggestions([]);
  dom.input.disabled = false;
  dom.guessButton.disabled = false;
}

function getSuggestions(query) {
  if (query.length < 1) return [];
  const normalizedQuery = normalize(query);
  return normalizedCards
    .filter((card) => card.normalizedName.includes(normalizedQuery))
    .filter(matchesFilters)
    .slice(0, 8);
}

function renderSuggestions(suggestions) {
  state.filteredSuggestions = suggestions;
  state.selectedSuggestionIndex = suggestions.length ? 0 : -1;
  dom.suggestions.innerHTML = "";

  suggestions.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `suggestion-item${index === state.selectedSuggestionIndex ? " active" : ""}`;
    button.innerHTML = `
      <img class="suggestion-art" src="${getCardImageUrl(card, "256x")}" alt="${card.name}" loading="lazy" />
      <span class="suggestion-copy">${card.name} · ${formatCardClasses(card)} · ${card.mana}${t('manaUnit')} · ${formatSeries(card)}</span>
    `;
    button.addEventListener("click", () => {
      dom.input.value = card.name;
      submitGuess(card.name);
    });
    button.addEventListener("mouseenter", () => showSuggestionPreview(card));
    button.addEventListener("focus", () => showSuggestionPreview(card));
    button.addEventListener("mouseleave", hideSuggestionPreview);
    button.addEventListener("blur", hideSuggestionPreview);
    dom.suggestions.appendChild(button);
  });

  if (!suggestions.length) {
    hideSuggestionPreview();
  }
}

function updateSuggestionHighlight() {
  [...dom.suggestions.children].forEach((child, index) => {
    child.classList.toggle("active", index === state.selectedSuggestionIndex);
  });
}

function formatClass(value) {
  return localizedMaps[state.locale].class[value] ?? value;
}

function getCardClasses(card) {
  if (Array.isArray(card.classes) && card.classes.length) {
    return card.classes;
  }
  return card.class ? [card.class] : [];
}

function formatCardClasses(card) {
  const classes = getCardClasses(card);
  if (!classes.length) {
    return t('unknown');
  }
  return classes.map((item) => formatClass(item)).join(" / ");
}

function formatValue(value) {
  const maps = localizedMaps[state.locale];
  return maps.rarity[value] ?? maps.type[value] ?? maps.expansion[value] ?? value;
}

function formatSpellSchool(value) {
  return localizedMaps[state.locale].school[value] ?? value ?? t('none');
}

function formatTribe(value) {
  return localizedMaps[state.locale].tribe[value] ?? value ?? t('none');
}

function formatKeyword(value) {
  return localizedMaps[state.locale].keyword[value] ?? value;
}

function formatSeries(card) {
  const base = formatValue(card.expansion);
  return `${base}${card.isMiniSet ? t('miniSuffix') : ''}`;
}

function formatHintTag(tag) {
  return t('hintTags')[tag] ?? tag;
}

function compareGuess(guess, answer) {
  const guessClasses = new Set(getCardClasses(guess));
  const answerClasses = new Set(getCardClasses(answer));
  const guessKeywords = new Set(guess.keywords ?? []);
  const answerKeywords = new Set(answer.keywords ?? []);
  const matchedKeywords = [...guessKeywords].filter((item) => answerKeywords.has(item));
  const answerKeywordSubsetMatched = [...answerKeywords].every((item) => guessKeywords.has(item));
  const tribeMatched = (guess.tribe ?? null) === (answer.tribe ?? null);
  const spellSchoolMatched = (guess.spellSchool ?? null) === (answer.spellSchool ?? null);
  return {
    class: [...guessClasses].some((item) => answerClasses.has(item)),
    rarity: guess.rarity === answer.rarity,
    type: guess.type === answer.type,
    series: guess.seriesCode === answer.seriesCode,
    mana: guess.mana === answer.mana,
    manaDirection: guess.mana < answer.mana ? "up" : guess.mana > answer.mana ? "down" : null,
    matchedKeywords,
    keywordsExact: answerKeywordSubsetMatched && guessKeywords.size === answerKeywords.size,
    tribe: tribeMatched,
    spellSchool: spellSchoolMatched,
  };
}

function getHintPool(card) {
  return card.hintTags?.length ? card.hintTags : [t('defaultHint')];
}

function revealHint() {
  if (!state.answer) return;
  const pool = getHintPool(state.answer);
  const nextHint = pool.find((hint) => !state.revealedHints.includes(hint));
  if (!nextHint) {
    setStatus(t('statusHintsDone'));
    return;
  }
  state.revealedHints.push(nextHint);
  renderHints();
  setStatus(`${t('hintPrefix')}${formatHintTag(nextHint)}`);
}

function revealAnswerByGiveUp() {
  if (!state.answer || state.finished) return;
  state.finished = true;
  dom.input.disabled = true;
  dom.guessButton.disabled = true;
  dom.winBanner.classList.remove("hidden");
  dom.winBanner.classList.add("failed");
  dom.resultLabel.textContent = t('resultLose');
  dom.resultTitle.textContent = t('resultLoseTitle');
  dom.winMessage.textContent = t('giveUpMessage')(state.answer.name);
  dom.winCardImage.src = getCardImageUrl(state.answer, "512x");
  dom.winCardImage.alt = t('artAlt')(state.answer.name);
  setStatus(`${t('statusGiveUp')}${state.answer.name}`);
}

function renderHints() {
  dom.hintList.innerHTML = state.revealedHints
    .map((hint) => `<span class="hint-chip">${formatHintTag(hint)}</span>`)
    .join("");
}

function submitGuess(rawName) {
  if (state.finished) return;

  const query = normalize(rawName ?? dom.input.value);
  if (!query) {
    setStatus(t('statusNeedInput'));
    return;
  }

  const guessedCard = normalizedCards.find((card) => card.normalizedName === query);
  if (!guessedCard) {
    setStatus(t('statusNotFound'));
    return;
  }

  if (state.guesses.some((entry) => entry.card.id === guessedCard.id)) {
    setStatus(t('statusDuplicate'));
    return;
  }

  const result = compareGuess(guessedCard, state.answer);
  state.guesses.unshift({ card: guessedCard, result });
  dom.guessCount.textContent = String(state.guesses.length);
  dom.emptyState.classList.add("hidden");
  dom.input.value = "";
  renderSuggestions([]);
  renderHistory();

  if (result.class && result.rarity && result.type && result.series && result.mana) {
    state.finished = true;
    dom.input.disabled = true;
    dom.guessButton.disabled = true;
    dom.winBanner.classList.remove("hidden");
    dom.winBanner.classList.remove("failed");
    dom.resultLabel.textContent = t('resultWin');
    dom.resultTitle.textContent = t('resultWinTitle');
    dom.winMessage.textContent = t('answerMessage')(guessedCard.name, state.guesses.length);
    dom.winCardImage.src = getCardImageUrl(guessedCard, "512x");
  dom.winCardImage.alt = t('artAlt')(guessedCard.name);
    setStatus(t('statusSolved'));
  } else {
    setStatus(`${t('statusSubmitted')}${guessedCard.name}`);
  }
}

function setStatus(message) {
  dom.statusMessage.textContent = message;
}

function createValueCell(text, statusClass, extraContent = "") {
  const cell = document.createElement("div");
  cell.className = `cell ${statusClass}`;
  cell.innerHTML = extraContent || `<span>${text}</span>`;
  return cell;
}

function createKeywordCell(card, result) {
  if (!card.keywords?.length) {
    return createValueCell(t('none'), result.keywordsExact ? "correct" : "wrong");
  }

  const html = card.keywords
    .map((keyword) => {
      const matched = result.matchedKeywords.includes(keyword);
      return `<span class="keyword-chip ${matched ? "correct" : "wrong"}">${formatKeyword(keyword)}</span>`;
    })
    .join("");

  const stateClass = result.keywordsExact ? "correct" : result.matchedKeywords.length ? "partial" : "wrong";
  return createValueCell("", stateClass, `<div class="keyword-list">${html}</div>`);
}

function shouldShowTribeColumn() {
  return state.guesses.some((entry) => entry.result.type && entry.card.type === "MINION");
}

function shouldShowSpellSchoolColumn() {
  return state.guesses.some((entry) => entry.result.type && entry.card.type === "SPELL");
}

function renderHistory() {
  dom.guessHistory.innerHTML = "";
  const showTribeColumn = shouldShowTribeColumn();
  const showSpellSchoolColumn = shouldShowSpellSchoolColumn();
  const extraColumns = (showTribeColumn ? 1 : 0) + (showSpellSchoolColumn ? 1 : 0);

  if (showTribeColumn && !state.unlockedHints.tribe) {
    state.unlockedHints.tribe = true;
    showToast(t('toastTribe'));
  }

  if (showSpellSchoolColumn && !state.unlockedHints.spellSchool) {
    state.unlockedHints.spellSchool = true;
    showToast(t('toastSchool'));
  }

  state.guesses.forEach(({ card, result }) => {
    const row = document.createElement("div");
    row.className = "guess-row row";
    row.style.gridTemplateColumns = `minmax(150px, 1.4fr) repeat(${6 + extraColumns}, minmax(82px, 1fr))`;

    const nameCell = document.createElement("div");
    nameCell.className = "name-cell";
    nameCell.innerHTML = `
      <img class="history-art" src="${getCardImageUrl(card, "256x")}" alt="${card.name}" loading="lazy" />
      <div class="name-stack">
        <strong>${card.name}</strong>
        <small>${card.id} · ${formatSeries(card)}</small>
      </div>
    `;

    const classCell = createValueCell(formatCardClasses(card), result.class ? "correct" : "wrong");
    const rarityCell = createValueCell(formatValue(card.rarity), result.rarity ? "correct" : "subtle-wrong");
    const typeCell = createValueCell(formatValue(card.type), result.type ? "correct" : "wrong");
    const expansionCell = createValueCell(formatSeries(card), result.series ? "correct" : "wrong");
    const keywordCell = createKeywordCell(card, result);

    let manaCell;
    if (result.mana) {
      manaCell = createValueCell(`${card.mana}${t('manaUnit')}`, "correct");
    } else {
      const arrow = result.manaDirection === "up" ? "↑" : "↓";
      const arrowClass = result.manaDirection === "up" ? "up" : "down";
      manaCell = createValueCell(
        `${card.mana}${t('manaUnit')}`,
        `mana-${result.manaDirection}`,
        `<div class="mana-stack"><strong>${card.mana}</strong><span class="mana-arrow ${arrowClass}">${arrow}</span></div>`
      );
    }

    row.append(nameCell, classCell, rarityCell, manaCell, typeCell, expansionCell, keywordCell);

    if (showTribeColumn) {
      row.append(createValueCell(formatTribe(card.tribe), result.tribe ? "correct" : "wrong"));
    }

    if (showSpellSchoolColumn) {
      row.append(createValueCell(formatSpellSchool(card.spellSchool), result.spellSchool ? "correct" : "wrong"));
    }

    dom.guessHistory.appendChild(row);
  });

  updateTableHead(showTribeColumn, showSpellSchoolColumn);
}

function updateTableHead(showTribeColumn, showSpellSchoolColumn) {
  const tableHead = document.querySelector(".table-head");
  const extraColumns = (showTribeColumn ? 1 : 0) + (showSpellSchoolColumn ? 1 : 0);
  tableHead.style.gridTemplateColumns = `minmax(150px, 1.4fr) repeat(${6 + extraColumns}, minmax(82px, 1fr))`;
  tableHead.innerHTML = `
    <span>${t('table')[0]}</span>
    <span>${t('table')[1]}</span>
    <span>${t('table')[2]}</span>
    <span>${t('table')[3]}</span>
    <span>${t('table')[4]}</span>
    <span>${t('table')[5]}</span>
    <span>${t('table')[6]}</span>
    ${showTribeColumn ? `<span>${t('tribe')}</span>` : ""}
    ${showSpellSchoolColumn ? `<span>${t('spellSchool')}</span>` : ""}
  `;
}

dom.input.addEventListener("input", (event) => {
  refreshSuggestions();
  setStatus("");
});

dom.input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" && state.filteredSuggestions.length) {
    event.preventDefault();
    state.selectedSuggestionIndex = (state.selectedSuggestionIndex + 1) % state.filteredSuggestions.length;
    updateSuggestionHighlight();
    return;
  }

  if (event.key === "ArrowUp" && state.filteredSuggestions.length) {
    event.preventDefault();
    state.selectedSuggestionIndex = (state.selectedSuggestionIndex - 1 + state.filteredSuggestions.length) % state.filteredSuggestions.length;
    updateSuggestionHighlight();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    if (state.filteredSuggestions.length && state.selectedSuggestionIndex >= 0) {
      const selected = state.filteredSuggestions[state.selectedSuggestionIndex];
      dom.input.value = selected.name;
      submitGuess(selected.name);
      return;
    }
    submitGuess();
  }

  if (event.key === "Escape") {
    renderSuggestions([]);
  }
});

dom.guessButton.addEventListener("click", () => submitGuess());
dom.restartButton.addEventListener("click", resetGame);
dom.giveUpButton.addEventListener("click", revealAnswerByGiveUp);
dom.playAgainButton.addEventListener("click", resetGame);
dom.hintButton.addEventListener("click", revealHint);

[dom.filterClass, dom.filterType, dom.filterMana, dom.filterSeries].forEach((element) => {
  element.addEventListener("change", (event) => {
    const keyMap = {
      "filter-class": "class",
      "filter-type": "type",
      "filter-mana": "mana",
      "filter-series": "series",
    };
    const key = keyMap[event.target.id];
    state.filters[key] = event.target.value;
    refreshSuggestions();
  });
});

dom.modeSelect.addEventListener("change", (event) => {
  state.mode = event.target.value;
  resetGame();
  refreshSuggestions();
});

dom.localeSelect.addEventListener('change', (event) => {
  state.locale = event.target.value;
  loadSnapshot(state.snapshotKey).then(() => applyLocale());
});

dom.snapshotSelect.addEventListener("change", async (event) => {
  await loadSnapshot(event.target.value);
});

dom.clearFilters.addEventListener("click", () => {
  state.filters = { class: "", type: "", mana: "", series: "" };
  dom.filterClass.value = "";
  dom.filterType.value = "";
  dom.filterMana.value = "";
  dom.filterSeries.value = "";
  refreshSuggestions();
});

async function init() {
  try {
    const manifestResponse = await fetch("./data/snapshots/manifest.json");
    if (!manifestResponse.ok) {
      throw new Error(t('manifestError')(manifestResponse.status));
    }
    snapshotManifest = await manifestResponse.json();
    await loadSnapshot(snapshotManifest.defaultSnapshot);
    applyLocale();
  } catch (error) {
    console.error(error);
    setStatus(state.locale === 'zh' ? '题库加载失败，请刷新页面重试。' : 'Failed to load card data. Refresh and try again.');
    dom.input.disabled = true;
    dom.guessButton.disabled = true;
  }
}

init();
