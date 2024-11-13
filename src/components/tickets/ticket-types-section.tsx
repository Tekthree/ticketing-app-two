'use client'

import { useState } from 'react'
import { useTicketTypes } from '@/hooks/use-ticket-types'
import { Button } from '@/components/ui/button'
import { TicketTypeForm } from './ticket-type-form'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { type Database } from '@/lib/supabase/types'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

interface TicketTypesSectionProps {
  eventId: string
  isOrganizer: boolean
}

export function TicketTypesSection({
  eventId,
  isOrganizer,
}: TicketTypesSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const {
    ticketTypes,
    loading,
    error,
    createTicketType,
    updateTicketType,
    deleteTicketType,
  } = useTicketTypes(eventId)

  const handleCreate = async (
    data: Omit<TicketType, 'id' | 'created_at' | 'quantity_sold'>
  ) => {
    await createTicketType(data)
    setIsAdding(false)
  }

  const handleUpdate = async (
    id: string,
    data: Omit<TicketType, 'id' | 'created_at' | 'quantity_sold'>
  ) => {
    await updateTicketType(id, data)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket type?')) {
      await deleteTicketType(id)
    }
  }

  if (loading) {
    return <div>Loading ticket types...</div>
  }

  if (error) {
    return <div className='text-red-600'>Error: {error.message}</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Ticket Types</h2>
        {isOrganizer && !isAdding && (
          <Button onClick={() => setIsAdding(true)} size='sm'>
            <Plus className='h-4 w-4 mr-2' />
            Add Ticket Type
          </Button>
        )}
      </div>

      {isAdding && (
        <div className='bg-gray-50 p-4 rounded-lg'>
          <TicketTypeForm
            eventId={eventId}
            onSubmit={handleCreate}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      <div className='grid gap-4'>
        {ticketTypes.length === 0 ? (
          <p className='text-gray-500'>No ticket types created yet.</p>
        ) : (
          ticketTypes.map(ticketType => (
            <div
              key={ticketType.id}
              className='bg-white p-4 rounded-lg shadow border'
            >
              {editingId === ticketType.id ? (
                <TicketTypeForm
                  eventId={eventId}
                  initialData={ticketType}
                  onSubmit={data => handleUpdate(ticketType.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>{ticketType.name}</h3>
                    <div className='mt-1 text-sm text-gray-500'>
                      Price: ${ticketType.price.toFixed(2)}
                    </div>
                    <div className='mt-1 text-sm text-gray-500'>
                      Available:{' '}
                      {ticketType.quantity - ticketType.quantity_sold} of{' '}
                      {ticketType.quantity}
                    </div>
                  </div>

                  {isOrganizer && (
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setEditingId(ticketType.id)}
                      >
                        <Edit2 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(ticketType.id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-500' />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
