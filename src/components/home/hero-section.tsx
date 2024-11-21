// @@filename: src/components/home/hero-section.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className='relative min-h-[90vh] flex items-center'>
      <div className='absolute inset-0 bg-gradient-to-b from-black/50 to-black/80' />
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url('/api/placeholder/1920/1080')`,
        }}
      />

      <div className='relative container mx-auto px-4 py-12 sm:py-20'>
        <div className='max-w-4xl'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-4xl sm:text-6xl md:text-8xl font-bold text-white tracking-tight mb-6'
          >
            FIND MORE
            <br />
            OF THE
            <br />
            EVENTS
            <br />
            YOU LOVE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl'
          >
            Incredible live shows. Upfront pricing. Relevant recommendations. We
            make going out easy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              size='lg'
              className='bg-yellow-400 hover:bg-yellow-500 text-black font-bold'
            >
              <Link href='/explore'>Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
