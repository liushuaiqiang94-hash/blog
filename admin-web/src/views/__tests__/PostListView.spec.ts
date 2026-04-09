import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PostListView from '../PostListView.vue'
import { createAdminRouter } from '../../router'
import { AUTH_SESSION_KEY } from '../../stores/auth'

const fetchMock = vi.fn()

function createJsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

async function mountList(path = '/posts') {
  const pinia = createPinia()
  const router = createAdminRouter({ history: createMemoryHistory(), pinia })
  await router.push(path)
  await router.isReady()

  return {
    router,
    wrapper: mount(PostListView, {
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

describe('PostListView', () => {
  it('redirects anonymous access to the login page', async () => {
    const { router } = await mountList()

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('loads posts and deletes a record', async () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ username: 'admin' }))
    vi.stubGlobal('confirm', vi.fn(() => true))

    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse([
          {
            id: 1,
            title: 'First post',
            slug: 'first-post',
            summary: 'Visible in the list.',
            status: 'PUBLISHED',
            updatedAt: '2026-04-09T10:00:00',
          },
          {
            id: 2,
            title: 'Second post',
            slug: 'second-post',
            summary: 'Will be removed.',
            status: 'DRAFT',
            updatedAt: '2026-04-09T11:00:00',
          },
        ]),
      )
      .mockResolvedValueOnce(createJsonResponse({}, 204))
      .mockResolvedValueOnce(
        createJsonResponse([
          {
            id: 2,
            title: 'Second post',
            slug: 'second-post',
            summary: 'Will be removed.',
            status: 'DRAFT',
            updatedAt: '2026-04-09T11:00:00',
          },
        ]),
      )

    const { wrapper } = await mountList()

    await flushPromises()

    expect(wrapper.get('[data-testid="post-list"]').text()).toContain('First post')
    expect(wrapper.get('[data-testid="post-list"]').text()).toContain('Second post')

    await wrapper.get('[data-testid="delete-post-1"]').trigger('click')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/posts/1',
      expect.objectContaining({ method: 'DELETE' }),
    )
    expect(wrapper.get('[data-testid="post-list"]').text()).not.toContain('First post')
  })
})
