# 我的个人博客

这是一个使用 Jekyll 和 GitHub Pages 构建的静态博客。

## 写新文章

在 `_posts` 中新建 `YYYY-MM-DD-文章标题.md`，并在开头写入：

```yaml
---
layout: post
title: 文章标题
date: 2026-08-06 10:00:00 +0800
tags: [技术]
description: 一句话摘要
---
```

## 发布到 GitHub Pages

1. 创建名为 `你的用户名.github.io` 的 GitHub 仓库。
2. 修改 `_config.yml` 中的标题、作者和 `url`。
3. 推送 `main` 分支；`.github/workflows/pages.yml` 会自动构建和部署网站。

## 发布到 EdgeOne Pages

`main` 分支推送后，`.github/workflows/edgeone.yml` 会自动构建网站，并将生成的静态文件发布到 `edgeone-pages` 分支。

在 EdgeOne 中选择 `edgeone-pages` 分支，并设置：

```text
框架预设：Other
根目录：/
安装命令：留空
编译命令：留空
输出目录：/
```
