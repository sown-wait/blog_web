# 雪&snow 项目结构说明

本文档说明“雪&snow”个人博客的目录职责、内容管理方式、构建流程、路由机制和腾讯云 EdgeOne Pages 部署要求。

项目是一个 **Vue 3 单页应用（SPA）**，使用 **Vite** 构建，博客文章和站点资料全部保存在仓库中。项目不包含后端服务、数据库、鉴权、服务端渲染（SSR）或任何运行时 API 请求。

## 1. 总体目录树

```text
blog/
├─ .github/
│  └─ workflows/
│     └─ edgeone.yml                 # GitHub Actions：构建并发布 dist 到 edgeone-pages 分支
├─ public/
│  └─ favicon.svg                    # 原样复制到 dist 根目录的站点图标
├─ src/
│  ├─ assets/
│  │  └─ styles/
│  │     └─ global.css               # 全站主题变量、布局、响应式与页面样式
│  ├─ components/
│  │  ├─ CategoryFilter.vue          # 首页分类筛选按钮组
│  │  ├─ PostCard.vue                # 首页单篇文章卡片
│  │  └─ SocialIcon.vue              # 关于页社交链接图标
│  ├─ config/
│  │  └─ about.json                  # “关于我”页面的静态资料
│  ├─ pages/
│  │  ├─ HomePage.vue                # 首页：Hero、文章分类与文章列表
│  │  ├─ PostDetailPage.vue          # 文章详情页：/post/:id
│  │  └─ AboutPage.vue               # 关于我页面：/about
│  ├─ posts/
│  │  ├─ static-notes.md             # 示例文章：前端分类
│  │  ├─ designing-for-reading.md    # 示例文章：设计分类
│  │  └─ small-winter-things.md      # 示例文章：随笔分类
│  ├─ router/
│  │  └─ index.js                    # Vue Router 路由表与滚动行为
│  ├─ utils/
│  │  └─ posts.js                    # Markdown 加载、Frontmatter 解析、排序和日期格式化
│  ├─ App.vue                        # 全站壳：顶部导航、路由视图、页脚
│  └─ main.js                        # Vue 应用入口
├─ .gitignore                        # Git 忽略规则
├─ index.html                        # Vite HTML 入口模板
├─ package.json                      # 依赖、npm 命令和项目元信息
├─ package-lock.json                 # 精确依赖锁定文件，供 npm ci 使用
├─ README.md                         # 快速开始与基本写作说明
├─ PROJECT_STRUCTURE.md              # 本文档
├─ vite.config.js                    # Vite、Vue、Markdown 插件与构建配置
├─ node_modules/                     # 本地安装的依赖，不提交到 Git
└─ dist/                             # npm run build 生成的部署产物，不手动编辑
```

> `node_modules/` 和 `dist/` 均由 `.gitignore` 忽略。前者可用 `npm ci` 重建，后者可用 `npm run build` 重建。

## 2. 根目录文件

### `package.json`

项目的 npm 配置入口，定义依赖和常用命令：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

| 命令 | 用途 | 说明 |
|---|---|---|
| `npm install` | 安装依赖 | 开发环境首次使用即可执行。 |
| `npm ci` | 按锁文件安装依赖 | CI/CD 环境推荐使用，版本稳定且更适合自动构建。 |
| `npm run dev` | 启动开发服务器 | 默认使用 Vite 本地服务，可热更新。 |
| `npm run build` | 生成静态站点 | 生成可部署的 `dist/` 目录。 |
| `npm run preview` | 预览构建产物 | 本地检查 `dist/` 是否可正常加载。 |

当前关键依赖如下：

| 依赖 | 作用 |
|---|---|
| `vue` | Vue 3 运行时和组件系统。 |
| `vue-router` | 浏览器前端路由，提供首页、文章页、关于页的地址映射。 |
| `vite` | 开发服务器与生产构建工具。 |
| `@vitejs/plugin-vue` | 让 Vite 识别并编译 `.vue` 和 Markdown 生成的 Vue 组件。 |
| `unplugin-vue-markdown` | 将 `.md` 文章内容编译为可直接渲染的 Vue 组件。 |

### `package-lock.json`

锁定所有直接和间接依赖的精确版本。不要手动修改；在调整依赖后由 npm 自动更新。GitHub Actions 使用 `npm ci` 时必须依赖此文件。

### `vite.config.js`

Vite 的核心配置文件，主要职责：

1. 注册 Vue 插件，编译 `.vue` 组件。
2. 注册 `unplugin-vue-markdown`，将 `src/posts/` 内的 `.md` 文件编译为 Vue 组件。
3. 定义 `@` 别名，指向 `src/`。例如 `@/pages/HomePage.vue` 等同于 `src/pages/HomePage.vue`。
4. 将生产输出目录固定为 `dist/`。
5. 使用 `appType: 'spa'` 声明这是一个单页应用。

`vite.config.js` 只影响本地开发和构建过程，不会原样出现在最终站点中。

### `index.html`

Vite 的 HTML 模板，不是完整页面内容。它只提供：

- 文档语言、视口、主题色和 SEO 描述；
- Vue 挂载节点：`<div id="app"></div>`；
- 开发入口：`<script type="module" src="/src/main.js"></script>`。

执行 `npm run build` 后，Vite 会自动把开发入口替换为带哈希的静态 JavaScript 文件，例如：

```html
<script type="module" crossorigin src="/assets/index-xxxxxxxx.js"></script>
```

**线上 HTML 如果仍然引用 `/src/main.js`，说明平台部署了源码根目录而没有执行 Vite 构建，这会导致空白页。**

### `.gitignore`

忽略不应提交的本地文件：

- `node_modules/`：依赖安装目录；
- `dist/`：可重复构建的静态产物；
- `*.log`：调试与运行日志；
- `.DS_Store`：macOS 文件管理器元数据。

### `README.md`

面向快速使用者的简版文档。本文档提供更完整的架构和维护说明。

## 3. `src/`：应用源码目录

`src/` 是实际需要维护的前端源码。除 `public/` 中的原样静态资源外，Vue 组件、样式、内容、数据和路由都应放在这里。

### `src/main.js`：应用启动入口

`main.js` 按以下顺序启动应用：

1. 引入 Vue 的 `createApp`；
2. 引入根组件 `App.vue`；
3. 引入 Vue Router；
4. 引入全局样式；
5. 创建应用、注册路由、挂载到 `#app`。

代码中的 `.use(router)` 使所有页面和组件都可以使用 `RouterLink`、`RouterView`、`useRoute()` 等路由能力。

### `src/App.vue`：全站外壳

`App.vue` 不负责具体页面内容，而是负责每个页面共有的结构：

- 固定顶部导航，包含“首页”和“关于我”；
- 中间的 `<RouterView>`，用于显示当前路由匹配到的页面组件；
- 页面切换过渡动画；
- 全站页脚。

新增一个页面时，通常只需新增页面组件并在 `src/router/index.js` 注册，无需复制导航和页脚。

## 4. `src/pages/`：路由页面

页面组件和 URL 路由一一对应。它们负责组合业务组件、读取路由参数和组织页面语义。

### `HomePage.vue`

对应地址：`/`

负责：

- 展示博客欢迎区域；
- 展示文章总数；
- 展示分类筛选器；
- 按分类筛选文章；
- 以文章卡片网格展示文章。

文章数据来自 `src/utils/posts.js` 导出的 `posts` 和 `categories`，没有发起网络请求。

### `PostDetailPage.vue`

对应地址：`/post/:id`

例如：

```text
/post/static-notes
/post/designing-for-reading
```

页面从 URL 读取 `id`，调用 `findPost(id)` 获取对应文章对象，再通过：

```vue
<component :is="post.component" />
```

渲染由 Markdown 插件编译生成的 Vue 文章组件。

找不到文章时会显示站内 404 提示和返回首页链接。这个 404 是前端页面状态，不等同于 EdgeOne 的 HTTP 404 响应。

### `AboutPage.vue`

对应地址：`/about`

页面只读取本地 `src/config/about.json`，用于显示：

- 名称和角色；
- 个人简介；
- 所在城市与邮箱；
- 常用技术；
- GitHub、邮箱等社交链接。

修改个人资料不需要修改 Vue 模板，直接更新 JSON 即可。

## 5. `src/components/`：可复用组件

组件目录只放多个页面可使用或具有明确独立职责的界面模块。

### `CategoryFilter.vue`

首页的分类按钮组。

- 输入：分类数组 `categories`、当前分类 `activeCategory`；
- 输出：`update:activeCategory` 事件；
- 在 `HomePage.vue` 中通过 `v-model:active-category` 双向绑定。

如果未来增加标签筛选，可以新增 `TagFilter.vue`，保持相同的“输入状态、触发事件、父页面保存状态”的模式。

### `PostCard.vue`

展示一篇文章的摘要信息：

- 分类；
- 格式化后的发布日期；
- 标题；
- 摘要；
- 跳转到详情页的链接。

它接收一个 `post` 对象，不直接读取 Markdown 文件，因此可以在首页、搜索结果、相关推荐等任意区域复用。

### `SocialIcon.vue`

根据 `about.json` 中的 `icon` 字段渲染 GitHub 或邮件图标。新增社交平台时，需要同时：

1. 在 `about.json` 添加链接对象；
2. 在 `SocialIcon.vue` 添加对应图标分支。

## 6. `src/posts/`：文章内容目录

这是博客内容的唯一来源。每篇文章使用一个 `.md` 文件，文件名会直接成为文章 ID 和 URL 的一部分。

### 6.1 文件命名规则

推荐文件名：

```text
src/posts/vue-static-site.md
src/posts/css-layout-notes.md
src/posts/2026-year-review.md
```

对应访问地址：

```text
/post/vue-static-site
/post/css-layout-notes
/post/2026-year-review
```

建议：

- 使用小写英文、数字和连字符；
- 不要包含空格、中文、`?`、`#`、`/` 等 URL 特殊字符；
- 修改文件名会改变文章 URL，已分享的旧链接将失效；
- 文章 ID 目前不支持嵌套目录。

### 6.2 文章 Frontmatter

每篇文章必须以 Frontmatter 开始。Frontmatter 位于文件最前面，两组 `---` 之间：

```md
---
title: Vue 3 静态博客搭建记录
date: 2026-08-08
category: 前端
tags: [Vue, Vite, 静态站点]
excerpt: 使用 Vue 3 和 Vite 构建纯静态个人博客的实践记录。
---

## 正文标题

这里是文章正文。
```

字段说明：

| 字段 | 是否必填 | 格式 | 用途 |
|---|---|---|---|
| `title` | 建议必填 | 单行文本 | 文章列表、详情页标题与浏览器标题。 |
| `date` | 建议必填 | `YYYY-MM-DD` | 首页倒序排序和文章发布时间。 |
| `category` | 建议必填 | 单行文本 | 首页分类筛选依据。 |
| `tags` | 可选 | `[标签一, 标签二]` | 文章详情页展示标签。 |
| `excerpt` | 建议必填 | 单行文本 | 首页卡片摘要和详情页导语。 |

当前解析器位于 `src/utils/posts.js`，为保持稳定，应遵守以下限制：

- 每个字段占一行；
- 冒号后紧跟字段值；
- `tags` 使用方括号和英文逗号，例如 `[Vue, Vite]`；
- `title`、`category`、`excerpt` 不写多行 YAML 内容；
- 日期使用 `YYYY-MM-DD`，避免加入时区和时间造成排序歧义。

### 6.3 正文支持的 Markdown

`unplugin-vue-markdown` 负责把正文编译为 Vue 组件，常用 Markdown 都可以使用：

```md
## 二级标题

普通段落，支持 **加粗**、*斜体* 和 [链接](https://example.com)。

- 无序列表
- 第二项

1. 有序列表
2. 第二项

> 引用内容

```js
const message = '代码块'
```
```

文章正文样式由 `src/assets/styles/global.css` 的 `.markdown-body` 规则统一控制。

### 6.4 新建文章流程

1. 在 `src/posts/` 新建一个 `.md` 文件；
2. 填写 Frontmatter；
3. 写入 Markdown 正文；
4. 运行 `npm run dev` 本地预览；
5. 检查首页排序、分类、详情页 URL；
6. 运行 `npm run build` 确认生产构建通过；
7. 推送源码分支，由 EdgeOne 或 GitHub Actions 完成部署。

无需手动注册文章：`import.meta.glob('../posts/*.md')` 会在构建时自动扫描目录下所有 Markdown 文件。

## 7. `src/utils/posts.js`：文章数据层

这个文件是文章系统的核心，它集中处理以下工作：

```text
src/posts/*.md
      │
      ├─ import.meta.glob(... ?raw) → 读取原始文本并解析 Frontmatter
      │
      └─ import.meta.glob(...)      → 获取 Markdown 编译后的 Vue 组件
                    │
                    ▼
        posts：统一文章对象数组
                    │
           ┌────────┴────────┐
           ▼                 ▼
      HomePage.vue      PostDetailPage.vue
```

每篇文章被标准化为如下对象：

```js
{
  id: 'static-notes',
  title: '把博客留在静态文件里',
  date: '2026-08-08',
  category: '前端',
  tags: ['Vue', 'Vite', '静态站点'],
  excerpt: '不依赖服务端和数据库...',
  component: MarkdownVueComponent
}
```

模块还提供：

- `posts`：按 `date` 倒序排列后的所有文章；
- `categories`：从文章分类自动去重生成的分类数组，首项固定为“全部”；
- `findPost(id)`：按文章 ID 查找文章；
- `formatDate(date)`：格式化为中文日期。

因此分类不需要维护单独的 JSON 文件。添加一篇新分类的文章后，该分类会自动出现在首页筛选器中。

## 8. `src/config/`：站点静态配置

### `about.json`

`about.json` 是“关于我”页面的资料源，字段结构示例：

```json
{
  "name": "雪&snow",
  "role": "前端开发者 / 独立创作者",
  "bio": "个人简介",
  "location": "中国 · 杭州",
  "email": "hello@example.com",
  "skills": ["Vue 3", "Vite"],
  "socialLinks": [
    {
      "name": "GitHub",
      "url": "https://github.com/你的用户名",
      "icon": "github"
    }
  ]
}
```

维护建议：

- 部署前把示例邮箱 `hello@example.com` 改为真实邮箱；
- 把 GitHub 链接改为个人主页；
- `skills` 是字符串数组，会自动生成技术标签；
- `socialLinks` 中的 `icon` 必须有 `SocialIcon.vue` 对应实现。

未来如果需要站点名称、导航、SEO 默认信息等可维护数据，可在本目录新增 `site.json`，而不是散落在多个 Vue 组件里。

## 9. `src/assets/` 与 `public/` 的区别

### `src/assets/`

存放参与 Vite 构建的资源，目前包含全局样式：

```text
src/assets/styles/global.css
```

这里的资源会被打包、压缩并输出为带内容哈希的文件，例如：

```text
dist/assets/index-xxxxxxxx.css
```

`global.css` 内集中定义：

- 色彩变量：主色 `#667eea`、辅助色 `#764ba2`；
- 全站布局容器；
- 导航、首页、文章页、关于页样式；
- Markdown 排版；
- 移动端响应式规则；
- 页面和列表切换动画。

### `public/`

存放不需要被 Vite 打包处理的静态文件。该目录内文件会被原样复制到 `dist/` 根目录：

```text
public/favicon.svg  →  dist/favicon.svg
```

适合放置：

- favicon；
- `robots.txt`；
- 静态验证文件；
- 不需要内容哈希的固定下载文件。

如果新增 `public/robots.txt`，网站访问路径会是：

```text
https://你的域名/robots.txt
```

## 10. `src/router/index.js`：路由规则

项目使用：

```js
createWebHistory()
```

当前路由表：

| URL | 路由名称 | 页面组件 | 作用 |
|---|---|---|---|
| `/` | `home` | `HomePage.vue` | 首页和分类筛选。 |
| `/post/:id` | `post` | `PostDetailPage.vue` | 指定文章详情。 |
| `/about` | `about` | `AboutPage.vue` | 个人资料页面。 |

例如浏览器访问：

```text
/post/static-notes
```

Vue Router 会把 `static-notes` 解析为 `route.params.id`，然后由 `findPost('static-notes')` 找到对应文章。

### 为什么需要 SPA 回退

`createWebHistory()` 会产生不带 `#` 的干净 URL，但静态托管服务器并不知道 `/post/static-notes` 是 Vue 前端路由。直接访问该地址时，服务器会尝试寻找同名文件；如果没有回退规则，服务器就会返回 HTTP 404。

因此必须在 EdgeOne Pages 配置：

```text
未匹配路径  →  /index.html
```

服务器返回 `index.html` 后，浏览器中的 Vue Router 才能根据当前 URL 渲染正确文章。

## 11. 构建流程与 `dist/`

执行：

```bash
npm run build
```

处理过程：

```text
src/*.vue + src/posts/*.md + src/assets/* + public/*
                         │
                         ▼
                    Vite 构建
                         │
                         ▼
dist/
├─ index.html
├─ favicon.svg
└─ assets/
   ├─ index-xxxxxxxx.js
   └─ index-xxxxxxxx.css
```

`dist/` 是唯一应交给静态托管服务的目录。里面的 JavaScript 已经包含：

- Vue 应用代码；
- Vue Router；
- 所有 `.vue` 组件；
- 所有 Markdown 正文；
- 文章元数据与筛选逻辑。

生产环境不需要：

- Node.js 运行时；
- 数据库；
- Ruby / Jekyll；
- Vue 开发服务器；
- 任何后端 API。

## 12. GitHub Actions 与 EdgeOne 部署

### `/.github/workflows/edgeone.yml`

当前工作流在 `main` 分支推送后执行：

1. 检出源码；
2. 安装 Node.js 22；
3. 使用 `npm ci` 安装锁定依赖；
4. 执行 `npm run build`；
5. 将 `dist/` 的内容发布到 `edgeone-pages` 分支。

因此仓库中的两个分支职责不同：

| 分支 | 内容 | 适用的 EdgeOne 设置 |
|---|---|---|
| `main` | Vue 源码、Markdown、配置、构建配置 | 必须由 EdgeOne 执行 npm 安装和 Vite 构建。 |
| `edgeone-pages` | 构建后的 `dist` 文件内容 | 可直接静态托管，不需要安装或构建。 |

### 方案 A：由 EdgeOne 构建 `main` 分支

若 EdgeOne 连接 `main` 分支，应使用：

```text
框架预设：Vite
根目录：/
安装命令：npm ci
构建命令：npm run build
输出目录：dist
```

### 方案 B：由 GitHub Actions 生成 `edgeone-pages` 分支

若 EdgeOne 连接工作流生成的 `edgeone-pages` 分支，应使用：

```text
框架预设：Other
根目录：/
安装命令：留空
构建命令：留空
输出目录：/
```

不要把 `main` 分支设置为“无需构建、输出目录 `/`”。这样 EdgeOne 会直接返回源码 `index.html`，其中仍引用 `/src/main.js`，浏览器无法编译 `.vue` 文件，最终会出现空白页。

### EdgeOne 检查清单

部署后检查：

1. 查看页面源代码，确认脚本地址是 `/assets/index-xxxx.js`，而不是 `/src/main.js`；
2. 访问首页 `/`，确认能显示文章卡片；
3. 直接在新标签访问 `/post/static-notes`，确认 SPA 回退生效；
4. 访问 `/about`，确认 `about.json` 数据显示正常；
5. 修改一篇 Markdown 后重新触发构建，确认新文章出现在首页。

## 13. 日常维护边界

| 需求 | 应修改的位置 |
|---|---|
| 新增文章 | `src/posts/新文章.md` |
| 改文章标题、日期、分类、摘要 | 对应 Markdown 的 Frontmatter |
| 改文章正文 | 对应 Markdown 正文 |
| 修改个人资料和链接 | `src/config/about.json` |
| 修改首页文案和版块结构 | `src/pages/HomePage.vue` |
| 修改文章详情页结构 | `src/pages/PostDetailPage.vue` |
| 修改导航和页脚 | `src/App.vue` |
| 修改全站颜色、排版与响应式布局 | `src/assets/styles/global.css` |
| 新增页面 | `src/pages/` 新建组件，并在 `src/router/index.js` 注册 |
| 修改构建配置或 Markdown 行为 | `vite.config.js` |
| 修改自动发布流程 | `.github/workflows/edgeone.yml` |

## 14. 本地验证建议

每次准备部署前，建议执行：

```bash
npm run build
npm run preview
```

然后至少检查：

- 首页是否出现所有文章；
- 分类筛选是否正确；
- 每篇文章的 `/post/:id` URL 是否匹配文件名；
- Markdown 标题、列表、引用和代码块样式是否正常；
- 关于页资料与链接是否正确；
- 手机宽度下导航、文章卡片和详情页文字是否没有溢出。

## 15. 维护原则

1. 内容保存在 Markdown，结构与交互保存在 Vue，资料保存在 JSON。
2. 不在组件中写死重复的文章数据；新文章必须放在 `src/posts/`。
3. 不手动编辑 `dist/`；每次都从源码重新构建。
4. 不提交 `node_modules/`。
5. 使用 `npm ci` 保证本地 CI 与线上依赖一致。
6. 使用 `createWebHistory` 时始终保留 EdgeOne 的 `/index.html` SPA 回退规则。
