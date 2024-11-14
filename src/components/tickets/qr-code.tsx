// @@filename: src/components/tickets/qr-code.tsx

'use client'

import { useEffect, useRef } from 'react'

interface QrCodeProps {
  ticketNumber: string
  size?: number
}

export default function QrCode({ ticketNumber, size = 128 }: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // For now, just create a placeholder rectangle
    // You'll need to install and import a QR code library like 'qrcode'
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, size, size)
      }
    }
  }, [ticketNumber, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className='rounded-lg shadow-sm'
    />
  )
}
