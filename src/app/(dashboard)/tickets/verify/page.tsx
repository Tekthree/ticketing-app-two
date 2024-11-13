'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle, ScanLine } from 'lucide-react'

interface VerificationResult {
  valid: boolean
  isOrganizer: boolean
  message?: string
  ticket?: {
    eventTitle: string
    ticketType: string
    quantity: number
    eventDate: string
    venue: string
  }
}

export default function VerifyTicketPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const { user } = useAuth()

  // In a real app, this would use a QR code scanner library
  const handleScan = async (orderId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tickets/verify/${orderId}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        valid: false,
        isOrganizer: false,
        message: 'Error scanning ticket',
      })
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, we'll use a text input
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const orderId = formData.get('orderId') as string
    if (orderId) {
      handleScan(orderId)
    }
  }

  if (!user) {
    return <div className='text-center'>Please log in to verify tickets</div>
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Verify Tickets</h1>
        <p className='text-muted-foreground'>
          Scan ticket QR codes to verify their validity
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='orderId'
            className='block text-sm font-medium text-gray-700'
          >
            Order ID
          </label>
          <div className='mt-1 flex gap-4'>
            <input
              type='text'
              name='orderId'
              id='orderId'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              placeholder='Enter order ID or scan QR code'
            />
            <Button type='submit' disabled={loading}>
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <ScanLine className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </form>

      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.valid ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              {result.valid ? (
                <CheckCircle2 className='h-6 w-6 text-green-400' />
              ) : (
                <XCircle className='h-6 w-6 text-red-400' />
              )}
            </div>
            <div className='ml-3'>
              <h3
                className={`text-sm font-medium ${
                  result.valid ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.valid ? 'Valid Ticket' : 'Invalid Ticket'}
              </h3>
              {result.message && (
                <p className='mt-1 text-sm text-gray-700'>{result.message}</p>
              )}
              {result.ticket && (
                <div className='mt-2 text-sm text-gray-700'>
                  <p>Event: {result.ticket.eventTitle}</p>
                  <p>Type: {result.ticket.ticketType}</p>
                  <p>Quantity: {result.ticket.quantity}</p>
                  <p>
                    Date: {new Date(result.ticket.eventDate).toLocaleString()}
                  </p>
                  <p>Venue: {result.ticket.venue}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='text-sm text-gray-500'>
        <p>
          Note: In a production environment, this would use a camera to scan QR
          codes.
        </p>
      </div>
    </div>
  )
}
