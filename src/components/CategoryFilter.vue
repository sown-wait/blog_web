<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    required: true
  }
})

defineEmits(['update:activeCategory'])
</script>

<template>
  <div class="category-filter" aria-label="文章分类">
    <button
      v-for="category in categories"
      :key="category"
      class="filter-button"
      :class="{ active: category === activeCategory }"
      type="button"
      @click="$emit('update:activeCategory', category)"
    >
      {{ category }}
    </button>
  </div>
</template>
