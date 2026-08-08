<script setup>
import { RouterLink } from 'vue-router'
import { formatDate } from '@/utils/posts'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="post-card">
    <div class="post-card-topline">
      <span class="post-category">{{ post.category }}</span>
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
    </div>
    <h3><RouterLink :to="`/post/${post.id}`">{{ post.title }}</RouterLink></h3>
    <p>{{ post.excerpt }}</p>
    <RouterLink class="text-link" :to="`/post/${post.id}`">
      阅读全文
      <span aria-hidden="true">↗</span>
    </RouterLink>
  </article>
</template>
