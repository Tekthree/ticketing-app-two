// @@filename: src/hooks/use-event-images.ts
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EventImage {
  id: string
  url: string
  alt: string
  event_id: string
  created_at: string
}

export function useEventImages(eventId: string) {
  const [images, setImages] = useState<EventImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('event_images')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setImages(data || [])
      } catch (err) {
        console.error('Error fetching images:', err)
        setError(err instanceof Error ? err : new Error('Error fetching images'))
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [eventId])

  // Upload image
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }

      const newImage = await response.json()
      setImages(prev => [...prev, newImage])

      return newImage
    } catch (err) {
      console.error('Error uploading image:', err)
      throw err
    }
  }

  // Delete image
  const deleteImage = async (imageId: string) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/images?imageId=${imageId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete image')
      }

      setImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {
      console.error('Error deleting image:', err)
      throw err
    }
  }

  // Reorder images
  const reorderImages = async (orderedIds: string[]) => {
    try {
      const newOrder = orderedIds.map((id, index) => ({
        id,
        order: index,
      }))

      const { error } = await supabase.from('event_images').upsert(
        newOrder.map(({ id, order }) => ({
          id,
          order,
        }))
      )

      if (error) throw error

      // Update local state
      const orderedImages = orderedIds
        .map(id => images.find(img => img.id === id))
        .filter((img): img is EventImage => img !== undefined)

      setImages(orderedImages)
    } catch (err) {
      console.error('Error reordering images:', err)
      throw err
    }
  }

  return {
    images,
    loading,
    error,
    uploadImage,
    deleteImage,
    reorderImages,
  }
}