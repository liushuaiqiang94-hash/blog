<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import PostForm from '../components/PostForm.vue'
import { AdminApiError, createPost, fetchPostById, updatePost } from '../services/adminApi'
import { useAuthStore } from '../stores/auth'
import type { AdminPost, AdminPostInput } from '../types/post'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const post = ref<AdminPost | null>(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const isCreateMode = computed(() => route.name === 'post-create')
const pageTitle = computed(() => (isCreateMode.value ? '新建文章' : '编辑文章'))
const submitLabel = computed(() => (isCreateMode.value ? '创建并返回列表' : '保存并返回列表'))
const editorValues = computed<AdminPostInput>(() => {
  const current = post.value

  return {
    title: current?.title ?? '',
    slug: current?.slug ?? '',
    summary: current?.summary ?? '',
    contentMarkdown: current?.contentMarkdown ?? '',
    status: current?.status ?? 'DRAFT',
  }
})

function postId() {
  const value = route.params.id
  return Array.isArray(value) ? value[0] : value
}

async function handleUnauthorized() {
  authStore.clearSession()
  await router.push({ name: 'login' })
}

async function loadPost() {
  if (isCreateMode.value) {
    post.value = null
    errorMessage.value = ''
    return
  }

  const id = postId()
  if (!id) {
    errorMessage.value = '缺少文章 ID。'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    post.value = await fetchPostById(id)
  } catch (error) {
    post.value = null

    if (error instanceof AdminApiError && error.status === 401) {
      await handleUnauthorized()
      return
    }

    errorMessage.value = error instanceof Error ? error.message : '无法加载文章'
  } finally {
    isLoading.value = false
  }
}

async function submitPost(values: AdminPostInput) {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (isCreateMode.value) {
      await createPost(values)
    } else {
      const id = postId()
      if (!id) {
        throw new Error('缺少文章 ID。')
      }

      await updatePost(id, values)
    }

    await router.push({ name: 'post-list' })
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) {
      await handleUnauthorized()
      return
    }

    errorMessage.value = error instanceof Error ? error.message : '保存失败'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  void loadPost()
})

watch(
  () => route.params.id,
  () => {
    void loadPost()
  },
)
</script>

<template>
  <main class="page">
    <section class="page-toolbar">
      <div>
        <p class="eyebrow">admin-web</p>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-copy">表单保存后会回到列表页，便于快速继续管理下一篇文章。</p>
      </div>

      <RouterLink class="button button--ghost" :to="{ name: 'post-list' }">返回列表</RouterLink>
    </section>

    <section class="panel">
      <div v-if="isLoading" class="loading-state" data-testid="editor-loading">
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--line"></span>
        <span class="skeleton skeleton--line skeleton--short"></span>
      </div>

      <div v-else-if="errorMessage && !isCreateMode" class="empty-state empty-state--strong" data-testid="editor-error">
        <p>文章加载失败。</p>
        <p class="empty-state__detail">{{ errorMessage }}</p>
        <button class="button" type="button" @click="loadPost">重试</button>
      </div>

      <PostForm
        v-else
        :key="postId() ?? 'new'"
        :values="editorValues"
        :submit-label="submitLabel"
        :is-submitting="isSubmitting"
        :error-message="errorMessage"
        @submit="submitPost"
        @cancel="router.push({ name: 'post-list' })"
      />
    </section>
  </main>
</template>
