<script setup>
import { computed, ref } from 'vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import PostCard from '@/components/PostCard.vue'
import { categories, posts } from '@/utils/posts'

const activeCategory = ref('全部')

const visiblePosts = computed(() => {
  if (activeCategory.value === '全部') {
    return posts
  }

  return posts.filter((post) => post.category === activeCategory.value)
})
</script>

<template>
  <section class="hero-section">
    <div class="site-container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> PERSONAL NOTES</p>
        <h1>在纷扰里，<br />留一场安静的雪。</h1>
        <p class="hero-description">你好，这里是雪&snow。记录前端、设计与生活中那些值得反复回望的片刻。</p>
        <a class="hero-link" href="#articles">浏览文章 <span aria-hidden="true">↓</span></a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="snowflake snowflake-large">✳</div>
        <div class="snowflake snowflake-small">✦</div>
        <div class="art-label">08<br /><span>AUG</span></div>
      </div>
    </div>
  </section>

  <section id="articles" class="articles-section site-container">
    <div class="section-heading">
      <div>
        <p class="eyebrow"><span></span> WRITING</p>
        <h2>最近文章</h2>
      </div>
      <span class="article-count">{{ visiblePosts.length.toString().padStart(2, '0') }} 篇</span>
    </div>

    <CategoryFilter v-model:active-category="activeCategory" :categories="categories" />

    <TransitionGroup name="post-list" tag="div" class="post-grid">
      <PostCard v-for="post in visiblePosts" :key="post.id" :post="post" />
    </TransitionGroup>

    <p v-if="visiblePosts.length === 0" class="empty-state">这个分类暂时还没有文章。</p>
  </section>
</template>
