// @@filename: src/components/events/image-gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: {
    id: string
    url: string
    alt: string
  }[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // If no images, show placeholder
  if (!images?.length) {
    return (
      <div className='relative aspect-video w-full overflow-hidden'>
        <div className='absolute inset-0 bg-gray-900'>
          <div className='flex h-full items-center justify-center'>
            <span className='text-gray-500'>No images available</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-4 gap-2'>
        {/* Main image */}
        <div className='col-span-4 md:col-span-3'>
          <div
            className='relative aspect-[16/9] w-full cursor-pointer overflow-hidden'
            onClick={() => setSelectedImage(images[0]?.url)}
          >
            <Image
              src={images[0]?.url}
              alt={images[0]?.alt || 'Event main image'}
              fill
              className='object-cover'
            />
          </div>
        </div>

        {/* Thumbnails */}
        <div className='col-span-4 grid grid-cols-3 gap-2 md:col-span-1 md:grid-cols-1'>
          {images.slice(1, 4).map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'relative aspect-square cursor-pointer overflow-hidden',
                {
                  'hidden md:block': index === 3,
                }
              )}
              onClick={() => setSelectedImage(image.url)}
            >
              <Image
                src={image.url}
                alt={image.alt || `Event image ${index + 2}`}
                fill
                className='object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full screen image dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className='max-w-6xl bg-black p-0'>
          <div className='relative aspect-[16/9]'>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt='Full screen event image'
                fill
                className='object-contain'
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
