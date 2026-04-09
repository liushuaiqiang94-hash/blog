<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AdminApiError } from '../services/adminApi'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const heading = computed(() => '管理后台登录')

function resolveRedirectTarget() {
  return typeof route.query.redirect === 'string' ? route.query.redirect : '/posts'
}

async function submitLogin() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    })

    await router.push(resolveRedirectTarget())
  } catch (error) {
    if (error instanceof AdminApiError) {
      errorMessage.value = error.message
      return
    }

    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="page page--auth">
    <section class="auth-layout">
      <div class="auth-copy">
        <p class="eyebrow">admin-web</p>
        <h1 class="page-title">{{ heading }}</h1>
        <p class="page-copy">
          账号登录后管理文章列表、新建内容、编辑草稿并发布。界面保持简洁，便于快速操作。
        </p>
      </div>

      <form class="panel auth-panel" @submit.prevent="submitLogin">
        <div class="panel__header">
          <p class="panel__eyebrow">Session login</p>
          <h2 class="panel__title">进入后台</h2>
        </div>

        <div v-if="errorMessage" class="inline-alert" data-testid="login-error">
          {{ errorMessage }}
        </div>

        <div class="form-grid">
          <label class="field field--full">
            <span class="field__label">账号</span>
            <input
              v-model="username"
              name="username"
              class="input"
              type="text"
              autocomplete="username"
              required
            />
          </label>

          <label class="field field--full">
            <span class="field__label">密码</span>
            <input
              v-model="password"
              name="password"
              class="input"
              type="password"
              autocomplete="current-password"
              required
            />
          </label>
        </div>

        <button class="button button--wide" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '登录中…' : '登录' }}
        </button>
      </form>
    </section>
  </main>
</template>
