<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-container header-inner">
        <RouterLink class="brand" to="/" aria-label="返回雪&snow首页">
          <span class="brand-mark" aria-hidden="true">✳</span>
          <span>雪<span class="brand-amp">&</span>snow</span>
        </RouterLink>

        <nav class="main-nav" aria-label="主导航">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/about">关于我</RouterLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="site-container footer-inner">
        <span>雪&snow · 用文字保存片刻</span>
        <span>© {{ new Date().getFullYear() }}</span>
      </div>
    </footer>
  </div>
</template>
