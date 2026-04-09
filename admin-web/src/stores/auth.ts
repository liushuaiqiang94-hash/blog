import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { AdminApiError, login as loginRequest, logout as logoutRequest } from '../services/adminApi'
import type { LoginPayload } from '../types/post'

export const AUTH_SESSION_KEY = 'admin-web.auth'

function readSessionUsername(): string | null {
  const raw = sessionStorage.getItem(AUTH_SESSION_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as { username?: string }
    return typeof parsed.username === 'string' ? parsed.username : null
  } catch {
    return null
  }
}

function writeSessionUsername(username: string) {
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ username }))
}

export const useAuthStore = defineStore('auth', () => {
  const username = shallowRef<string | null>(null)
  const isHydrated = shallowRef(false)

  const isAuthenticated = computed(() => Boolean(username.value))

  function hydrate() {
    if (isHydrated.value) {
      return
    }

    isHydrated.value = true
    username.value = readSessionUsername()
  }

  function setSession(nextUsername: string | null) {
    username.value = nextUsername

    if (nextUsername) {
      writeSessionUsername(nextUsername)
      return
    }

    sessionStorage.removeItem(AUTH_SESSION_KEY)
  }

  async function login(payload: LoginPayload) {
    const response = await loginRequest(payload)
    setSession(response.username)
    return response
  }

  async function logout() {
    try {
      await logoutRequest()
    } catch (error) {
      if (!(error instanceof AdminApiError) || error.status !== 401) {
        throw error
      }
    } finally {
      setSession(null)
    }
  }

  function clearSession() {
    setSession(null)
  }

  return {
    username,
    isAuthenticated,
    hydrate,
    login,
    logout,
    clearSession,
  }
})
