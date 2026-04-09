import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PostEditorView from '../PostEditorView.vue'
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

async function mountEditor(path = '/posts/new') {
  const pinia = createPinia()
  const router = createAdminRouter({ history: createMemoryHistory(), pinia })
  await router.push(path)
  await router.isReady()

  return {
    router,
    wrapper: mount(PostEditorView, {
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

describe('PostEditorView', () => {
  it('creates a new post and returns to the list', async () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ username: 'admin' }))
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        id: 3,
        title: 'Created post',
        slug: 'created-post',
        summary: 'Saved from the editor.',
        contentMarkdown: '# Created post',
        status: 'DRAFT',
      }),
    )

    const { router, wrapper } = await mountEditor('/posts/new')

    await wrapper.get('[name="title"]').setValue('Created post')
    await wrapper.get('[name="slug"]').setValue('created-post')
    await wrapper.get('[name="summary"]').setValue('Saved from the editor.')
    await wrapper.get('[name="contentMarkdown"]').setValue('# Created post')
    await wrapper.get('[name="status"]').setValue('DRAFT')
    await wrapper.get('form').trigger('submit.prevent')

    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/posts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'Created post',
          slug: 'created-post',
          summary: 'Saved from the editor.',
          contentMarkdown: '# Created post',
          status: 'DRAFT',
        }),
      }),
    )
    expect(router.currentRoute.value.path).toBe('/posts')
  })

  it('loads an existing post and updates it', async () => {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ username: 'admin' }))
    fetchMock
      .mockResolvedValueOnce(
        createJsonResponse({
          id: 9,
          title: 'Original title',
          slug: 'original-title',
          summary: 'Original summary.',
          contentMarkdown: 'Original content.',
          status: 'DRAFT',
        }),
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          id: 9,
          title: 'Updated title',
          slug: 'updated-title',
          summary: 'Updated summary.',
          contentMarkdown: 'Updated content.',
          status: 'PUBLISHED',
        }),
      )

    const { router, wrapper } = await mountEditor('/posts/9/edit')

    await flushPromises()

    await wrapper.get('[name="title"]').setValue('Updated title')
    await wrapper.get('[name="slug"]').setValue('updated-title')
    await wrapper.get('[name="summary"]').setValue('Updated summary.')
    await wrapper.get('[name="contentMarkdown"]').setValue('Updated content.')
    await wrapper.get('[name="status"]').setValue('PUBLISHED')
    await wrapper.get('form').trigger('submit.prevent')

    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/posts/9',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated title',
          slug: 'updated-title',
          summary: 'Updated summary.',
          contentMarkdown: 'Updated content.',
          status: 'PUBLISHED',
        }),
      }),
    )
    expect(router.currentRoute.value.path).toBe('/posts')
  })
})
