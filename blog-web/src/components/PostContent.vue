<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { PublicPostDetail } from '../types/post'

const props = defineProps<{
  post: PublicPostDetail
}>()

const publishedLabel = computed(() => {
  if (!props.post.publishedAt) {
    return 'Unpublished'
  }

  return props.post.publishedAt.replace('T', ' ')
})

const renderedMarkdown = computed(() => marked.parse(props.post.contentMarkdown))
</script>

<template>
  <article class="article-shell post-content" data-testid="post-content">
    <header class="article-shell__header">
      <p class="post-card__eyebrow">Featured article</p>
      <h1 class="article-shell__title" data-testid="post-title">{{ post.title }}</h1>
      <p class="article-shell__summary">{{ post.summary }}</p>
      <div class="meta-row">
        <span>{{ publishedLabel }}</span>
        <span class="status-badge">{{ post.status.toLowerCase() }}</span>
      </div>
    </header>

    <div class="markdown-body" v-html="renderedMarkdown" />
  </article>
</template>
