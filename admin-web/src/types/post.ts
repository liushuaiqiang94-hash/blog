export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface AdminPostInput {
  title: string
  slug: string
  summary: string
  contentMarkdown: string
  status: PostStatus
}

export interface AdminPost extends AdminPostInput {
  id: number
  createdAt?: string | null
  updatedAt?: string | null
  publishedAt?: string | null
}

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  username: string
}
