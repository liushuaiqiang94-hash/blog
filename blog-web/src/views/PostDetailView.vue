<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PostContent from '../components/PostContent.vue'
import { fetchPostBySlug, PostApiError } from '../services/postApi'
import type { PublicPostDetail } from '../types/post'

const route = useRoute()
const post = ref<PublicPostDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const notFoundMessage = ref('')

const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value[0] : value
})

async function loadPost() {
  if (!slug.value) {
    post.value = null
    errorMessage.value = 'Missing post slug.'
    notFoundMessage.value = ''
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  notFoundMessage.value = ''

  try {
    post.value = await fetchPostBySlug(slug.value)
  } catch (error) {
    post.value = null

    if (error instanceof PostApiError && error.status === 404) {
      notFoundMessage.value = error.message || 'Post not found.'
      errorMessage.value = ''
    } else {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to load post'
      notFoundMessage.value = ''
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadPost()
})

watch(slug, () => {
  void loadPost()
})
</script>

<template>
  <section class="page page--detail">
    <div class="page__topbar">
      <RouterLink class="button button--ghost" to="/" data-testid="detail-back">Back to posts</RouterLink>
    </div>

    <section class="panel">
      <div v-if="isLoading" class="loading-state" data-testid="detail-loading">
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--line"></span>
        <span class="skeleton skeleton--line skeleton--short"></span>
      </div>

      <div v-else-if="notFoundMessage" class="empty-state empty-state--strong" data-testid="detail-not-found">
        <p>{{ notFoundMessage }}</p>
        <p class="empty-state__detail">Try another post or return to the homepage.</p>
      </div>

      <div v-else-if="errorMessage" class="error-state" data-testid="detail-error">
        <p>We could not load this post.</p>
        <p class="error-state__detail">{{ errorMessage }}</p>
        <button class="button" type="button" data-testid="detail-retry" @click="loadPost">Retry</button>
      </div>

      <PostContent v-else-if="post" :post="post" />
    </section>
  </section>
</template>
