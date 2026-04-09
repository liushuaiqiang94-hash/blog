import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PostDetailView from '../PostDetailView.vue'

const fetchMock = vi.fn()

function createJsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response
}

async function mountDetail(path = '/hello-vue') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/:slug', name: 'post-detail', component: PostDetailView },
    ],
  })

  await router.push(path)
  await router.isReady()

  return mount(PostDetailView, {
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

describe('PostDetailView', () => {
  it('loads the post from the slug route', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        id: 1,
        slug: 'hello-vue',
        title: 'Hello Vue',
        summary: 'A short guide to the app shell.',
        contentMarkdown: 'Welcome to the blog.',
        status: 'PUBLISHED',
        publishedAt: '2026-04-09T09:30:00',
      }),
    )

    const wrapper = await mountDetail('/hello-vue')

    await flushPromises()

    expect(wrapper.get('[data-testid="post-title"]').text()).toBe('Hello Vue')
  })

  it('renders markdown content for the requested post', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        id: 1,
        slug: 'hello-vue',
        title: 'Hello Vue',
        summary: 'A short guide to the app shell.',
        contentMarkdown: '# Hello Vue\n\nThis is **Markdown** content.',
        status: 'PUBLISHED',
        publishedAt: '2026-04-09T09:30:00',
      }),
    )

    const wrapper = await mountDetail('/hello-vue')

    expect(wrapper.find('[data-testid="detail-loading"]').exists()).toBe(true)

    await flushPromises()

    expect(wrapper.get('[data-testid="post-title"]').text()).toBe('Hello Vue')
    expect(wrapper.get('[data-testid="post-content"]').html()).toContain('<h1>Hello Vue</h1>')
    expect(wrapper.get('[data-testid="post-content"]').html()).toContain('<strong>Markdown</strong>')
  })

  it('shows a not found state when the post is missing', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({ message: 'Post not found' }, 404),
    )

    const wrapper = await mountDetail('/missing-post')

    await flushPromises()

    expect(wrapper.get('[data-testid="detail-not-found"]').text()).toContain('Post not found')
    expect(wrapper.find('[data-testid="detail-back"]').exists()).toBe(true)
  })

  it('shows an error state when the post request fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('timeout'))

    const wrapper = await mountDetail('/hello-vue')

    await flushPromises()

    expect(wrapper.get('[data-testid="detail-error"]').text()).toContain('Network request failed')
    expect(wrapper.find('[data-testid="detail-retry"]').exists()).toBe(true)
  })
})
