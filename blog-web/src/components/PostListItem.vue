<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { PublicPostSummary } from '../types/post'

const props = defineProps<{
  post: PublicPostSummary
}>()

const publishedLabel = computed(() => {
  if (!props.post.publishedAt) {
    return 'Unpublished'
  }

  return props.post.publishedAt.replace('T', ' ')
})
</script>

<template>
  <article class="post-card">
    <RouterLink
      class="post-card__link"
      :to="{ name: 'post-detail', params: { slug: post.slug } }"
      :aria-label="`Read ${post.title}`"
    >
      <div class="post-card__header">
        <p class="post-card__eyebrow">Published story</p>
        <span class="status-badge">{{ post.status.toLowerCase() }}</span>
      </div>
      <h2 class="post-card__title">{{ post.title }}</h2>
      <p class="post-card__summary">{{ post.summary }}</p>
      <div class="meta-row">
        <span>{{ publishedLabel }}</span>
        <span class="meta-row__arrow">Read article</span>
      </div>
    </RouterLink>
  </article>
</template>
