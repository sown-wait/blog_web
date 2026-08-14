---
title: 把博客留在静态文件里
date: 2026-08-08
category: 测试
tags: [Vue, Vite, 静态站点]
excerpt: 不依赖服务端和数据库，仍然可以拥有足够自由、足够轻快的个人写作空间。
---

## 为什么选择纯静态

测试
## 写作与构建

这座小站使用 Vue 3 渲染界面，使用 Vite 把一切打包到 `dist`。文章的标题、日期、摘要和分类都写在 Frontmatter 中，首页读取这些信息生成文章列表；点击文章后，Markdown 会作为 Vue 组件显示正文。

```js
const posts = import.meta.glob('../posts/*.md', { eager: true })
```

代码很少，路径也很短。写作时只需要新建一个 Markdown 文件，下一次构建就会把它带到线上。

> 让工具退到幕后，把注意力还给文字本身。
