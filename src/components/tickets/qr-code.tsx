'use client'

interface QRCodeProps {
  value: string
  size?: number
}

export function QRCode({ value, size = 128 }: QRCodeProps) {
  // Create an SVG QR code without external dependencies
  // This is a simple implementation for demo purposes
  // In production, you might want to use a library like qrcode.react
  return (
    <div className='rounded-lg bg-white p-2 shadow-sm'>
      <svg
        viewBox='0 0 41 41'
        width={size}
        height={size}
        className='text-black'
        fill='currentColor'
      >
        <path d='M0,0 h41v41h-41z' fill='white' />
        <path d='M4,4 h15v15h-15z M7,7 h9v9h-9z' />
        <path d='M22,4 h15v15h-15z M25,7 h9v9h-9z' />
        <path d='M4,22 h15v15h-15z M7,25 h9v9h-9z' />
        <path d='M22,22 v4h4v-4z M26,22 v4h4v-4z M30,22 v4h4v-4z M34,22 v4h4v-4z' />
        <path d='M22,26 v4h4v-4z M26,26 v4h4v-4z M30,26 v4h4v-4z M34,26 v4h4v-4z' />
        <path d='M22,30 v4h4v-4z M26,30 v4h4v-4z M30,30 v4h4v-4z M34,30 v4h4v-4z' />
        <path d='M22,34 v4h4v-4z M26,34 v4h4v-4z M30,34 v4h4v-4z M34,34 v4h4v-4z' />
      </svg>
    </div>
  )
}
