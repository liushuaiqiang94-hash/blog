export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface PublicPostSummary {
  id: number
  slug: string
  title: string
  summary: string
  status: PostStatus
  publishedAt: string | null
}

export interface PublicPostDetail extends PublicPostSummary {
  contentMarkdown: string
}
