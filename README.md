<h1 align="center">Hearthstone Card Guess MVP</h1>

<p align="center">一个可直接打开游玩的炉石传说卡牌猜谜网页 MVP。</p>

<p align="center">
  <img alt="mode" src="https://img.shields.io/badge/mode-standard_snapshot-blue" />
  <img alt="ui" src="https://img.shields.io/badge/ui-bilingual-green" />
  <img alt="stack" src="https://img.shields.io/badge/stack-static_web-black" />
</p>

<hr />

<h2>项目简介</h2>

<p>
  这是一个基于炉石传说卡牌数据构建的 Wordle 风格竞猜网页。系统会从当前快照卡池中随机选择一张卡牌，玩家通过不断输入卡名来缩小范围，并根据字段反馈逐步锁定答案。
</p>

<ul>
  <li>标准环境快照机制</li>
  <li>简单 / 中等 / 困难模式</li>
  <li>中英双语 UI 与中英双语卡牌名</li>
  <li>关键词 / 种族 / 法术派系等推理维度</li>
  <li>提示系统、放弃看答案、卡图预览</li>
</ul>

<hr />

<h2>玩法说明</h2>

<h3>1. 基础目标</h3>

<p>
  每局游戏会在后台随机选出一张卡牌作为答案。玩家输入卡牌名称进行竞猜，系统会根据猜测卡和目标卡的字段差异给出可视化反馈。
</p>

<h3>2. 核心比对字段</h3>

<ul>
  <li>职业（多职业按集合交集判定）</li>
  <li>稀有度</li>
  <li>法力值</li>
  <li>卡牌类型</li>
  <li>所属系列</li>
  <li>关键词</li>
</ul>

<h3>3. 反馈规则</h3>

<ul>
  <li>完全匹配：绿色</li>
  <li>关键词部分命中：金色</li>
  <li>不匹配：红色 / 灰红色</li>
  <li>法力值错误：使用 ↑ / ↓ 提示目标更高或更低</li>
</ul>

<h3>4. 动态线索</h3>

<p>当玩家确认答案类型后，会自动解锁额外线索：</p>

<ul>
  <li>确认是随从后：显示种族列</li>
  <li>确认是法术后：显示法术派系列</li>
</ul>

<h3>5. 模式说明</h3>

<ul>
  <li><strong>简单模式</strong>：easy 卡池</li>
  <li><strong>中等模式</strong>：easy + medium 卡池</li>
  <li><strong>困难模式</strong>：全卡池</li>
</ul>

<h3>6. 提示系统</h3>

<p>
  提示和字段展示独立，提示内容来自卡牌效果标签，例如：抽牌、伤害、回血、召唤、护甲、随机效果、法术伤害、亡语互动、战吼互动等。
</p>

<hr />

<h2>目录结构</h2>

<ul>
  <li><code>index.html</code>：页面结构</li>
  <li><code>script.js</code>：前端逻辑、快照加载、语言切换、游戏规则</li>
  <li><code>styles.css</code>：页面样式</li>
  <li><code>data/raw/</code>：原始 HearthstoneJSON 数据源</li>
  <li><code>data/snapshots/</code>：可游玩的版本快照与清单</li>
  <li><code>docs/</code>：规则说明与 difficulty 文档</li>
 </ul>

<hr />

<h2>部署与依赖</h2>

<p>
  这是一个纯静态项目，不依赖数据库，也不需要用户登录。部署时可直接托管到 Vercel 等静态平台。
</p>

<ul>
  <li>运行依赖：<code>python3</code>（仅用于本地静态服务器）</li>
  <li>包管理：<code>npm</code>（只用于执行启动脚本）</li>
</ul>

<p>本地运行：</p>

<pre><code>npm run dev</code></pre>

<p>打开：</p>

<pre><code>http://127.0.0.1:3000</code></pre>
