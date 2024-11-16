// @@filename: src/types/event-images.ts
export interface EventImage {
  id: string
  event_id: string
  url: string
  alt: string
  order: number
  created_at: string
  updated_at: string
}

export interface ImageUploadResponse {
  id: string
  url: string
  alt: string
}

export interface ImageError {
  message: string
  code?: string
}