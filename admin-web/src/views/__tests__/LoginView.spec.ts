import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginView from '../LoginView.vue'
import { createAdminRouter } from '../../router'

const fetchMock = vi.fn()

function createJsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

async function mountLogin() {
  const pinia = createPinia()
  const router = createAdminRouter({ history: createMemoryHistory(), pinia })
  await router.push('/login')
  await router.isReady()

  return {
    router,
    wrapper: mount(LoginView, {
      global: {
        plugins: [pinia, router],
      },
    }),
  }
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
})

describe('LoginView', () => {
  it('logs in and redirects to the posts list', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ username: 'admin' }))

    const { router, wrapper } = await mountLogin()

    await wrapper.get('[name="username"]').setValue('admin')
    await wrapper.get('[name="password"]').setValue('secret')
    await wrapper.get('form').trigger('submit.prevent')

    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/posts')
    expect(sessionStorage.getItem('admin-web.auth')).toContain('admin')
  })

  it('shows a login error when credentials are rejected', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({ message: 'Invalid credentials' }, 401),
    )

    const { wrapper } = await mountLogin()

    await wrapper.get('[name="username"]').setValue('admin')
    await wrapper.get('[name="password"]').setValue('wrong')
    await wrapper.get('form').trigger('submit.prevent')

    await flushPromises()

    expect(wrapper.get('[data-testid="login-error"]').text()).toContain('Invalid credentials')
  })
})
