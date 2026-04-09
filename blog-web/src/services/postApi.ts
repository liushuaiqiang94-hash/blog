import type { PublicPostDetail, PublicPostSummary } from '../types/post'

const API_BASE = '/api/posts'

export class PostApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PostApiError'
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
    // Fall through to the raw text below.
  }

  return text || response.statusText || 'Request failed'
}

async function requestJson<T>(url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new PostApiError('Network request failed', 0)
  }

  if (!response.ok) {
    throw new PostApiError(await readErrorMessage(response), response.status)
  }

  return (await response.json()) as T
}

export function fetchPosts(): Promise<PublicPostSummary[]> {
  return requestJson<PublicPostSummary[]>(API_BASE)
}

export function fetchPostBySlug(slug: string): Promise<PublicPostDetail> {
  return requestJson<PublicPostDetail>(`${API_BASE}/${encodeURIComponent(slug)}`)
}
