// @@filename: src/app/test/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const testSignUp = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Starting signup test...')

      // First, check if user already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: 'tekthree@gmail.com',
        password: 'Test123456!',
      })

      if (existingUser?.user) {
        console.log('User already exists, signing out first...')
        await supabase.auth.signOut()
      }

      // Attempt signup
      console.log('Attempting signup...')
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: 'tekthree@gmail.com',
          password: 'Test123456!',
          options: {
            data: {
              full_name: 'Tek Three',
              role: 'organizer',
            },
          },
        })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        throw signUpError
      }

      console.log('Signup response:', signUpData)
      setResult({
        success: true,
        message: 'Signup test completed',
        data: signUpData,
      })
    } catch (e) {
      console.error('Full error:', e)
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Starting signin test...')

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: 'tekthree@gmail.com',
          password: 'Test123456!',
        })

      if (signInError) {
        console.error('Signin error:', signInError)
        throw signInError
      }

      console.log('Signin successful:', signInData)
      setResult({
        success: true,
        message: 'Signin test completed',
        data: signInData,
      })
    } catch (e) {
      console.error('Full error:', e)
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testSignOut = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Starting signout test...')

      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        console.error('Signout error:', signOutError)
        throw signOutError
      }

      console.log('Signout successful')
      setResult({
        success: true,
        message: 'Successfully signed out',
        data: null,
      })
    } catch (e) {
      console.error('Full error:', e)
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Checking current session...')

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session check error:', sessionError)
        throw sessionError
      }

      console.log('Current session:', session)
      setResult({
        success: true,
        message: session ? 'User is logged in' : 'No active session',
        data: session,
      })
    } catch (e) {
      console.error('Full error:', e)
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen p-8'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold'>Authentication Test</h1>
          <p className='text-gray-500'>
            Testing with email: tekthree@gmail.com
          </p>
          <p className='text-sm text-gray-500'>
            Open browser console to see detailed logs
          </p>
        </div>

        <div className='flex flex-wrap gap-4'>
          <Button onClick={testSignUp} disabled={loading}>
            {loading ? 'Testing...' : 'Test Sign Up'}
          </Button>

          <Button onClick={testSignIn} disabled={loading} variant='outline'>
            {loading ? 'Testing...' : 'Test Sign In'}
          </Button>

          <Button onClick={testSignOut} disabled={loading} variant='outline'>
            {loading ? 'Testing...' : 'Test Sign Out'}
          </Button>

          <Button onClick={checkSession} disabled={loading} variant='secondary'>
            {loading ? 'Checking...' : 'Check Session'}
          </Button>
        </div>

        {error && (
          <div className='p-4 bg-red-50 text-red-900 rounded-lg'>
            <h2 className='font-semibold'>Error</h2>
            <p className='text-sm'>{error}</p>
            <p className='mt-2 text-xs text-red-600'>
              Check browser console for more details
            </p>
          </div>
        )}

        {result && (
          <div className='p-4 bg-green-50 text-green-900 rounded-lg'>
            <h2 className='font-semibold'>{result.message}</h2>
            <pre className='mt-2 text-sm overflow-auto'>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
