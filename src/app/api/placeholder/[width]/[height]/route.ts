// @@filename: src/app/api/placeholder/[width]/[height]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  const width = parseInt(params.width)
  const height = parseInt(params.height)

  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        fill="#9ca3af"
        font-family="system-ui"
        font-size="16"
      >
        ${width} × ${height}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}