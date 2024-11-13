'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['user', 'organizer'], {
    required_error: 'Please select a role',
  }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setLoading(true)
      setError(null)

      // Sign up the user
      const { error: signUpError, data: authData } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
            },
          },
        }
      )

      if (signUpError) throw signUpError

      // Create profile entry
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: authData.user.id,
          full_name: data.fullName,
          role: data.role,
        })

        if (profileError) throw profileError
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label
          htmlFor='fullName'
          className='block text-sm font-medium text-gray-700'
        >
          Full Name
        </label>
        <input
          {...register('fullName')}
          type='text'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        />
        {errors.fullName && (
          <p className='mt-1 text-sm text-red-600'>{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <input
          {...register('email')}
          type='email'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          Password
        </label>
        <input
          {...register('password')}
          type='password'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        />
        {errors.password && (
          <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='role'
          className='block text-sm font-medium text-gray-700'
        >
          Role
        </label>
        <select
          {...register('role')}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        >
          <option value='user'>Attendee</option>
          <option value='organizer'>Event Organizer</option>
        </select>
        {errors.role && (
          <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>
        )}
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <Button type='submit' disabled={loading} className='w-full'>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
