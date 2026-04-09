import type { AdminPost, AdminPostInput, LoginPayload, LoginResponse } from '../types/post'

const API_BASE = '/api/admin'

export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

type ErrorBody = {
  message?: string
}

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text().catch(() => '')

  if (!text) {
    return response.statusText || 'Request failed'
  }

  try {
    const body = JSON.parse(text) as ErrorBody
    if (body?.message) {
      return body.message
    }
  } catch {
    // Ignore invalid JSON and fall back to raw text.
  }

  return text || response.statusText || 'Request failed'
}

function buildHeaders(initHeaders?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...initHeaders,
  }
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...init,
      headers: buildHeaders(init.headers),
    })
  } catch {
    throw new AdminApiError('Network request failed', 0)
  }

  if (!response.ok) {
    throw new AdminApiError(await readErrorMessage(response), response.status)
  }

  return (await response.json()) as T
}

async function requestVoid(path: string, init: RequestInit = {}): Promise<void> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...init,
      headers: buildHeaders(init.headers),
    })
  } catch {
    throw new AdminApiError('Network request failed', 0)
  }

  if (!response.ok) {
    throw new AdminApiError(await readErrorMessage(response), response.status)
  }
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return requestJson<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout(): Promise<void> {
  return requestVoid('/auth/logout', {
    method: 'POST',
  })
}

export function fetchPosts(): Promise<AdminPost[]> {
  return requestJson<AdminPost[]>('/posts')
}

export function fetchPostById(id: string | number): Promise<AdminPost> {
  return requestJson<AdminPost>(`/posts/${encodeURIComponent(String(id))}`)
}

export function createPost(payload: AdminPostInput): Promise<AdminPost> {
  return requestJson<AdminPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePost(id: string | number, payload: AdminPostInput): Promise<AdminPost> {
  return requestJson<AdminPost>(`/posts/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deletePost(id: string | number): Promise<void> {
  return requestVoid(`/posts/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  })
}
