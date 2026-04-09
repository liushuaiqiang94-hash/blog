<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { AdminApiError, deletePost as deletePostRequest, fetchPosts } from '../services/adminApi'
import { useAuthStore } from '../stores/auth'
import type { AdminPost } from '../types/post'

const router = useRouter()
const authStore = useAuthStore()

const posts = ref<AdminPost[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const deletingId = ref<number | null>(null)

const hasPosts = computed(() => posts.value.length > 0)

function formatTime(post: AdminPost) {
  const value = post.updatedAt ?? post.publishedAt ?? post.createdAt
  return value ? value.replace('T', ' ') : '暂无时间'
}

async function handleUnauthorized() {
  authStore.clearSession()
  await router.push({ name: 'login' })
}

async function loadPosts() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    posts.value = await fetchPosts()
  } catch (error) {
    posts.value = []

    if (error instanceof AdminApiError && error.status === 401) {
      await handleUnauthorized()
      return
    }

    errorMessage.value = error instanceof Error ? error.message : '无法加载文章'
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(postId: number) {
  const confirmed = window.confirm('确定删除这篇文章吗？')
  if (!confirmed) {
    return
  }

  deletingId.value = postId

  try {
    await deletePostRequest(postId)
    await loadPosts()
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) {
      await handleUnauthorized()
      return
    }

    errorMessage.value = error instanceof Error ? error.message : '删除失败'
  } finally {
    deletingId.value = null
  }
}

async function handleLogout() {
  await authStore.logout()
  await router.push({ name: 'login' })
}

onMounted(() => {
  void loadPosts()
})
</script>

<template>
  <main class="page">
    <section class="page-toolbar">
      <div>
        <p class="eyebrow">admin-web</p>
        <h1 class="page-title">文章管理</h1>
        <p class="page-copy">创建、编辑、发布和删除内容，所有请求都通过 cookie 会话完成。</p>
      </div>

      <div class="toolbar-actions">
        <RouterLink class="button button--ghost" :to="{ name: 'post-create' }">新建文章</RouterLink>
        <button class="button button--ghost" type="button" @click="handleLogout">退出登录</button>
      </div>
    </section>

    <section class="panel">
      <div v-if="isLoading" class="loading-state" data-testid="list-loading">
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--line"></span>
        <span class="skeleton skeleton--line skeleton--short"></span>
      </div>

      <div v-else-if="errorMessage" class="empty-state empty-state--strong" data-testid="list-error">
        <p>文章列表加载失败。</p>
        <p class="empty-state__detail">{{ errorMessage }}</p>
        <button class="button" type="button" @click="loadPosts">重试</button>
      </div>

      <div v-else-if="!hasPosts" class="empty-state empty-state--strong">
        <p>还没有文章。</p>
        <p class="empty-state__detail">点击“新建文章”开始创建第一篇内容。</p>
      </div>

      <div v-else class="post-table" data-testid="post-list">
        <div class="post-table__head">
          <span>标题</span>
          <span>状态</span>
          <span>时间</span>
          <span>操作</span>
        </div>

        <article v-for="post in posts" :key="post.id" class="post-row">
          <div class="post-row__main">
            <h2 class="post-row__title">{{ post.title }}</h2>
            <p class="post-row__summary">{{ post.summary }}</p>
            <p class="post-row__slug">/{{ post.slug }}</p>
          </div>

          <div class="post-row__meta">
            <span class="status-badge">{{ post.status }}</span>
          </div>

          <div class="post-row__meta">
            <span>{{ formatTime(post) }}</span>
          </div>

          <div class="post-row__actions">
            <RouterLink
              class="button button--ghost button--sm"
              :to="{ name: 'post-edit', params: { id: post.id } }"
            >
              编辑
            </RouterLink>
            <button
              class="button button--ghost button--sm"
              type="button"
              :data-testid="`delete-post-${post.id}`"
              :disabled="deletingId === post.id"
              @click="handleDelete(post.id)"
            >
              {{ deletingId === post.id ? '删除中…' : '删除' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
