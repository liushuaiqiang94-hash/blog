import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import HomeView from '../HomeView.vue'

const fetchMock = vi.fn()

function createJsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

async function mountHome() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/:slug', name: 'post-detail', component: { template: '<div />' } },
    ],
  })

  await router.push('/')
  await router.isReady()

  return mount(HomeView, {
    global: {
      plugins: [router],
    },
  })
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HomeView', () => {
  it('renders the published post list', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse([
        {
          id: 1,
          slug: 'hello-vue',
          title: 'Hello Vue',
          summary: 'A short guide to the app shell.',
          status: 'PUBLISHED',
          publishedAt: '2026-04-09T09:30:00',
        },
        {
          id: 2,
          slug: 'draft-note',
          title: 'Draft note',
          summary: 'This should stay hidden from the homepage.',
          status: 'DRAFT',
          publishedAt: null,
        },
      ]),
    )

    const wrapper = await mountHome()

    expect(wrapper.find('[data-testid="home-loading"]').exists()).toBe(true)

    await flushPromises()

    expect(wrapper.find('[data-testid="home-loading"]').exists()).toBe(false)
    expect(wrapper.get('.hero__eyebrow').text()).toContain('Minimal blog')
    expect(wrapper.get('[data-testid="post-list"]').text()).toContain('Hello Vue')
    expect(wrapper.get('[data-testid="post-list"]').text()).toContain('A short guide to the app shell.')
    expect(wrapper.get('[data-testid="post-list"]').text()).not.toContain('Draft note')
    expect(wrapper.find('a[href="/hello-vue"]').exists()).toBe(true)
  })

  it('shows an error state when loading posts fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'))

    const wrapper = await mountHome()

    await flushPromises()

    expect(wrapper.get('[data-testid="home-error"]').text()).toContain('Network request failed')
    expect(wrapper.find('[data-testid="home-retry"]').exists()).toBe(true)
  })
})
