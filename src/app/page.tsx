// @@filename: src/app/page.tsx
import { Hero } from '@/components/home/hero'
import { FeaturedEvents } from '@/components/home/featured-events'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedEvents />
    </main>
  )
}
