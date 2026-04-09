<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PostListItem from '../components/PostListItem.vue'
import { fetchPosts } from '../services/postApi'
import type { PublicPostSummary } from '../types/post'

const posts = ref<PublicPostSummary[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const publishedPosts = computed(() => posts.value.filter((post) => post.status === 'PUBLISHED'))

async function loadPosts() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    posts.value = await fetchPosts()
  } catch (error) {
    posts.value = []
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load posts'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadPosts()
})
</script>

<template>
  <section class="page">
    <header class="hero">
      <p class="hero__eyebrow">Minimal blog</p>
      <h1 class="hero__title">Fresh posts, simple reading.</h1>
      <p class="hero__copy">
        A focused front page for published stories, with quiet typography and a calm reading flow.
      </p>
    </header>

    <section class="panel">
      <div v-if="isLoading" class="loading-state" data-testid="home-loading">
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--line"></span>
        <span class="skeleton skeleton--line skeleton--short"></span>
      </div>

      <div v-else-if="errorMessage" class="error-state" data-testid="home-error">
        <p>We could not load the posts.</p>
        <p class="error-state__detail">{{ errorMessage }}</p>
        <button class="button" type="button" data-testid="home-retry" @click="loadPosts">Retry</button>
      </div>

      <div v-else-if="publishedPosts.length === 0" class="empty-state">
        <p>No published posts yet.</p>
        <p class="empty-state__detail">Once content is published, it will appear here automatically.</p>
      </div>

      <div v-else class="post-grid" data-testid="post-list">
        <PostListItem v-for="post in publishedPosts" :key="post.id" :post="post" />
      </div>
    </section>
  </section>
</template>
