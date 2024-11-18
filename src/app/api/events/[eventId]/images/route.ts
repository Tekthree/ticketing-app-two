// @@filename: src/app/api/events/[eventId]/images/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string }}
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