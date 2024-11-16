// @@filename: src/components/events/image-upload.tsx
'use client'

import { useRef, useState } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  eventId: string
  onUploadComplete?: () => void
  existingImages?: Array<{
    id: string
    url: string
    alt: string
  }>
}

export function ImageUpload({
  eventId,
  onUploadComplete,
  existingImages = [],
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileUpload = async (files: FileList) => {
    try {
      setUploading(true)
      setError(null)

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type and size
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Invalid file type. Only JPG, PNG and WebP are allowed.')
        }

        if (file.size > maxSize) {
          throw new Error('File size too large. Maximum size is 5MB.')
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `event-images/${eventId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath)

        // Save to event_images table
        const { error: dbError } = await supabase
          .from('event_images')
          .insert({
            event_id: eventId,
            url: urlData.publicUrl,
            alt: file.name.split('.')[0], // Use filename as alt text
          })

        if (dbError) throw dbError
      }

      onUploadComplete?.()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      await handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDelete = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('event_images')
        .delete()
        .eq('id', imageId)

      if (error) throw error
      onUploadComplete?.()
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'Error deleting image')
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag & drop images here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Supports: JPG, PNG, WebP (max 5MB per file)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {existingImages.map(image => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}