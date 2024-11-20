// @@filename: src/components/events/lineup-section.tsx
'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface Artist {
  name: string
  time: Date
  imageUrl?: string
  isFollowing?: boolean
}

interface LineupSectionProps {
  artists: Artist[]
}

export function LineupSection({ artists }: LineupSectionProps) {
  const [followingState, setFollowingState] = useState<Record<string, boolean>>(
    artists.reduce((acc, artist) => ({
      ...acc,
      [artist.name]: artist.isFollowing || false
    }), {})
  )

  const handleFollow = (artistName: string) => {
    setFollowingState(prev => ({
      ...prev,
      [artistName]: !prev[artistName]
    }))
  }

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-yellow-400" />
          Lineup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
          >
            <div className="flex items-center gap-4">
              {artist.imageUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="font-medium">{artist.name}</div>
                <div className="text-sm text-yellow-400">
                  {format(artist.time, 'h:mm a')}
                </div>
              </div>
            </div>

            <Button
              variant={followingState[artist.name] ? "default" : "outline"}
              size="sm"
              onClick={() => handleFollow(artist.name)}
              className={followingState[artist.name] 
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : ""
              }
            >
              {followingState[artist.name] ? 'Following' : 'Follow'}
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}