// @@filename: src/app/api/events/[eventId]/images/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and authorized
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has access to this event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', params.eventId)
      .single()

    if (eventError || !event || event.organizer_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this event' },
        { status: 403 }
      )
    }

    // Get the file from the request
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `event-images/${params.eventId}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath)

    // Save to event_images table
    const { data: imageData, error: dbError } = await supabase
      .from('event_images')
      .insert({
        event_id: params.eventId,
        url: urlData.publicUrl,
        alt: file.name.split('.')[0], // Use filename as alt text
      })
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    return NextResponse.json(imageData)
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and authorized
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has access to this event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', params.eventId)
      .single()

    if (eventError || !event || event.organizer_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this event' },
        { status: 403 }
      )
    }

    // Delete image from database and storage
    const { data: image, error: imageError } = await supabase
      .from('event_images')
      .delete()
      .eq('id', imageId)
      .eq('event_id', params.eventId)
      .select()
      .single()

    if (imageError) {
      throw imageError
    }

    // Extract storage path from URL
    const url = new URL(image.url)
    const storagePath = url.pathname.split('/').pop()
    
    if (storagePath) {
      await supabase.storage
        .from('event-images')
        .remove([`event-images/${params.eventId}/${storagePath}`])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}