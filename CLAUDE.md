# CLAUDE.md

## 项目概述

- 项目名：`hearthstone_card_guess`
- 类型：纯静态网页小游戏
- 玩法：类似 Wordle 的炉石传说猜卡游戏
- 技术栈：`index.html + script.js + styles.css + 本地 JSON 数据文件`
- 本地开发方式：使用 Python 静态服务器，无后端、无数据库、无登录系统

这个项目的核心不是“实时按规则动态算标准卡池”，而是：

- 预先准备好一组**可游玩的快照版本**
- 游戏启动后读取 `data/snapshots/manifest.json`
- 根据当前选择的 snapshot 加载对应的 `cards.json` / `cards.enUS.json`
- 然后在该快照卡池中随机抽一张卡做答案

也就是说：

- **标准轮换 / 新拓展上线 / 版本切换** 的真正落点，在 `data/snapshots/` 下面
- 前端逻辑只是“读取并使用快照”，不是负责定义标准环境规则

---

## 当前项目状态（截至 2026-03-20）

当前默认快照已经切到：

- `2026_year_of_the_beetle`

对应版本含义：

- 甲虫年（Year of the Beetle）
- 第一个拓展包 **Cataclysm / 浩劫与重生** 已上线

当前默认标准环境包含：

- `CORE`
- `EMERALD_DREAM`
- `THE_LOST_CITY`
- `TIME_TRAVEL`
- `CATACLYSM`

已经从标准模式移除的三个旧拓展包：

- `WHIZBANGS_WORKSHOP`
- `ISLAND_VACATION`
- `SPACE`

当前新快照文件：

- `data/snapshots/2026_year_of_the_beetle/cards.json`
- `data/snapshots/2026_year_of_the_beetle/cards.enUS.json`

当前上一版旧快照仍保留：

- `data/snapshots/2026_pre_expansion/cards.json`
- `data/snapshots/2026_pre_expansion/cards.enUS.json`

当前 `manifest.json` 中：

- `defaultSnapshot = 2026_year_of_the_beetle`
- 两个快照都保留，方便切换与回溯

---

## 目录结构说明

### 根目录关键文件

- `index.html`
  - 页面结构
  - 顶部 snapshot 描述文案
  - 各类筛选器与输入区

- `script.js`
  - 游戏主逻辑
  - manifest 加载
  - snapshot 切换
  - 中英语言切换
  - 猜卡判定逻辑
  - 历史记录渲染
  - 提示系统

- `styles.css`
  - 页面样式

- `README.md`
  - 对外项目介绍，较简略

- `CLAUDE.md`
  - 给后续 AI / 新机器开发使用的项目记忆文档

### 数据目录

- `data/raw/`
  - 原始 HearthstoneJSON 数据源
  - 包含中英文原始卡牌数据
  - 当前项目只把它当“原始素材”使用，不直接当可玩题库

- `data/snapshots/manifest.json`
  - 快照总入口
  - 定义默认快照、快照列表、每个快照的标签与卡牌路径

- `data/snapshots/<snapshot_key>/cards.json`
  - 中文题库快照

- `data/snapshots/<snapshot_key>/cards.enUS.json`
  - 英文题库快照

### 文档目录

- `docs/difficulty_v2.md`
  - 当前难度模型说明
  - 主要针对旧成品快照的打分逻辑

---

## 快照机制说明

### 设计原则

项目使用的是**静态快照机制**，不是按“某年标准规则”在浏览器里实时计算。

优点：

- 可控、稳定
- 版本回放容易
- 不依赖外部 API
- 页面打开即可玩

代价：

- 每次标准轮换或新拓展上线，需要人工生成一份新的快照数据

### manifest 结构

`data/snapshots/manifest.json` 里每个快照通常包含：

- `key`
- `label`
- `labelEn`
- `description`
- `descriptionEn`
- `generatedAt`
- `cardsPath`
- `cardsPathEn`
- `difficultyDocPath`

### 当前已有快照

1. `2026_year_of_the_beetle`
   - 甲虫年 + 浩劫与重生上线后的标准环境
   - 当前默认

2. `2026_pre_expansion`
   - 上一个可游玩成品快照
   - 表示 2026 首个新拓展上线前的标准环境

### 快照卡牌记录结构

快照中的每张卡并不完全等同于 raw 数据，而是经过项目侧整理后的结构。典型字段包括：

- `id`
- `dbfId`
- `name`
- `text`
- `class`
- `classes`
- `multiClassGroup`
- `rarity`
- `mana`
- `attack`
- `health`
- `type`
- `set`
- `expansion`
- `expansionZh`
- `isMiniSet`
- `seriesCode`
- `series`
- `tribe`
- `tribes`
- `spellSchool`
- `keywords`
- `hintTags`
- `difficultyBaseScore`
- `popularityInclusionPct`
- `popularityDeckHits`
- `difficultyScoreV2`
- `difficulty`

其中前端最依赖的字段有：

- `name`
- `classes`
- `rarity`
- `mana`
- `type`
- `seriesCode`
- `isMiniSet`
- `keywords`
- `tribe`
- `spellSchool`
- `difficulty`
- `hintTags`

---

## 游戏逻辑要点

### 快照加载

`script.js` 在初始化时会：

1. 读取 `./data/snapshots/manifest.json`
2. 获取 `defaultSnapshot`
3. 加载对应快照文件
4. 按当前语言选择：
   - 中文：`cardsPath`
   - 英文：`cardsPathEn`

### 语言机制

- UI 文案是内置在 `script.js` 的 `i18n` 对象里
- 快照数据也有中英文双份文件
- 切语言时会重新加载对应语言版本的快照数据

注意：

- 快照英文文件里的 `series` 目前仍沿用中文系列名，这是历史兼容做法
- 前端展示系列名时主要依赖 `expansion` + 本地映射，不强依赖 `series` 本身

### 猜卡判定字段

系统主要比较：

- 职业
- 稀有度
- 法力值
- 类型
- 所属系列（用 `seriesCode`）
- 关键词

额外动态列：

- 确认是随从后显示 `tribe`
- 确认是法术后显示 `spellSchool`

### 模式机制

- `easy`：只使用 `difficulty === easy`
- `medium`：使用 `easy + medium`
- `hard`：使用全卡池

---

## 难度系统现状

当前项目的正式难度说明在：

- `docs/difficulty_v2.md`

该文档描述的是旧成品题库的 `difficulty v2` 方案：

- 结构基础分 + HSGuru 热度修正
- easy / medium / hard 三档

注意：

- `2026_pre_expansion` 是完整成品快照，带较完整的难度分与热度字段
- `2026_year_of_the_beetle` 是为了甲虫年首拓展上线后尽快可玩而补出来的新静态快照
- 其中保留系列沿用了旧快照数据
- `CATACLYSM` 新卡已补成完整可玩结构，但其 `difficulty / hintTags / keywords` 是按现有规则自动整理出来的，不是重新跑过完整热度工作流后的精修成品

这意味着：

- 现在这个版本**可玩**
- 但如果后续要继续打磨，需要为 `CATACLYSM` 重新做一版更正式的难度与提示质量整理

---

## 甲虫年快照的来源与处理方式

### 做了什么

为了把甲虫年第一个拓展包版本做成完整静态可玩版，当前仓库已经：

1. 从旧快照 `2026_pre_expansion` 中保留以下系列卡：
   - `CORE`
   - `EMERALD_DREAM`
   - `THE_LOST_CITY`
   - `TIME_TRAVEL`

2. 从 `data/raw/raw_cards_zhCN.json` / `raw_cards_enUS.json` 中抽取：
   - `CATACLYSM`

3. 为 `CATACLYSM` 卡牌补齐项目需要的字段：
   - `seriesCode`
   - `series`
   - `expansionZh`
   - `keywords`
   - `hintTags`
   - `difficulty`
   - 其他基础显示字段

4. 最终生成两份静态快照：
   - 中文题库
   - 英文题库

### 当前卡池规模

当前 `2026_year_of_the_beetle` 快照总数为：

- `970` 张（中文）
- `970` 张（英文）

系列分布：

- `CORE`: 286
- `EMERALD_DREAM`: 183
- `TIME_TRAVEL`: 183
- `THE_LOST_CITY`: 183
- `CATACLYSM`: 135

说明：

- `CORE` 在 raw 数据里是 289，但当前沿用旧快照保留结果是 286
- 这说明旧快照本身做过题库清洗，过滤掉了部分不进入正式题库的记录
- 新快照为了保持风格一致，是基于旧快照保留卡 + 新拓展补入，而不是完全从 raw 重建全部标准卡池

这个选择是有意的，目的是尽量保持和上一版题库口径一致

---

## 本地运行方式

### 启动

```bash
npm run dev
```

实际等价于：

```bash
python3 -m http.server 3000
```

打开：

```text
http://127.0.0.1:3000
```

### 关闭

如果占用了 3000 端口，可以：

```bash
lsof -tiTCP:3000 -sTCP:LISTEN | xargs kill
```

截至写这份文档时，本地服务已经关闭。

---

## 改项目时的注意事项

### 1. 不要把“标准环境规则”写死在前端逻辑里

前端应该继续保持：

- 只读取 snapshot
- 不负责决定哪些拓展属于标准

标准环境的定义应该落在：

- `data/snapshots/manifest.json`
- `data/snapshots/<snapshot>/cards*.json`

### 2. 新版本优先继续走“新增快照”路线

当后续有：

- 新迷你包
- 第二个拓展包
- 下次标准轮换

推荐做法是：

- 新增一个 snapshot 目录
- 更新 manifest
- 不要直接覆盖旧快照

这样可以保留历史回放能力。

### 3. `script.js` 当前应保持静态加载

曾经临时尝试过“运行时根据 manifest 动态拼快照”的办法，但最后已经回退。

原因：

- 静态快照更稳定
- 更容易迁移机器
- 更容易排查数据问题
- 与这个项目的原设计一致

所以如果后续没有明确理由，不要再切回运行时拼装版本。

### 4. 新快照若要做成“高质量正式版”，要补难度工作流

当前甲虫年快照已可玩，但若要追求和旧版本一致的完成度，后续应补：

- 新标准环境题库清洗
- HSGuru 热度聚合
- `difficultyBaseScore` / `difficultyScoreV2` 重新计算
- `hintTags` 人工抽样校验

### 5. 中英题库要同步维护

每个新快照都要同时有：

- `cards.json`
- `cards.enUS.json`

否则切语言时会直接加载失败。

---

## 建议的后续工作清单

如果未来继续开发，优先级建议如下：

1. 为 `CATACLYSM` 补正式难度和热度评分
2. 校对 `CATACLYSM` 新卡的 `hintTags` 质量
3. 视需要更新 `docs/difficulty_v2.md`，让文档不再只描述旧快照
4. 增加生成快照的小脚本，避免下次继续手工拼
5. 增加一个简单校验脚本，检查：
   - manifest 路径是否存在
   - 中英文快照张数是否一致
   - 系列代码是否都能被 `localizedMaps.expansion` 正确显示

---

## 这次实际修改过的内容摘要

这轮主要完成了以下事情：

- 新增甲虫年完整静态快照目录和两份 cards 文件
- 更新 `manifest.json`，把甲虫年版本设为默认版本
- 更新 `script.js` 中系列名映射，加入 `CATACLYSM`
- 更新首页说明文案
- 更新 README 简介
- 停止本地开发服务

---

## 快速恢复上下文时建议先看这些文件

如果以后换机器继续开发，建议按这个顺序重新熟悉项目：

1. `CLAUDE.md`
2. `data/snapshots/manifest.json`
3. `script.js`
4. `data/snapshots/2026_year_of_the_beetle/cards.json`
5. `docs/difficulty_v2.md`

---

## 一句话总结

这是一个**基于静态快照卡池的炉石猜卡网页**；当前默认版本已经切到**甲虫年首拓展“浩劫与重生”上线后的标准环境**，并且已经是**完整静态可玩版**。
