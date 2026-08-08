# 雪&snow

基于 Vue 3、Vite 和 Markdown 的纯静态个人博客。

## 开发

```bash
npm install
npm run dev
```

## 发布

```bash
npm run build
npm run preview
```

构建产物位于 `dist/`，可以直接部署到 CDN 或腾讯云 EdgeOne Pages。

## 写文章

在 `src/posts/` 下新建 Markdown 文件。文件名会成为文章 ID，例如 `vue-static-site.md` 对应 `/post/vue-static-site`。

```md
---
title: 文章标题
date: 2026-08-08
category: 前端
tags: [Vue, Vite]
excerpt: 首页展示的文章摘要。
---

这里是正文。
```

EdgeOne Pages 需要将未匹配的路由回退到 `/index.html`，以支持 Vue Router 的 `createWebHistory` 深层链接。
