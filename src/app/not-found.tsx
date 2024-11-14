// @@filename: src/app/not-found.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='mb-4 mt-2 text-muted-foreground'>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  )
}
