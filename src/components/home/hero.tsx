// @@filename: src/components/home/hero.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative">
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/api/placeholder/1920/1080')`,
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[600px] flex-col items-start justify-center py-20">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Discover Amazing Events Near You
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-200">
            Find and book tickets for concerts, festivals, conferences, and
            more.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/explore">Explore Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}