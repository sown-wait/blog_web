<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findPost, formatDate } from '@/utils/posts'

const route = useRoute()
const post = computed(() => findPost(route.params.id))
</script>

<template>
  <section v-if="post" class="post-page site-container">
    <RouterLink class="back-link" to="/">← 返回文章列表</RouterLink>

    <header class="post-header">
      <div class="post-meta">
        <span>{{ post.category }}</span>
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </div>
      <h1>{{ post.title }}</h1>
      <p>{{ post.excerpt }}</p>
      <div class="tag-list">
        <span v-for="tag in post.tags" :key="tag"># {{ tag }}</span>
      </div>
    </header>

    <article class="markdown-body">
      <component :is="post.component" />
    </article>
  </section>

  <section v-else class="not-found site-container">
    <p class="eyebrow"><span></span> 404</p>
    <h1>这篇文章正在雪里散步。</h1>
    <RouterLink class="primary-link" to="/">回到首页</RouterLink>
  </section>
</template>
