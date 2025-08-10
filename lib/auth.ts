import { createClient, isSupabaseConfigured } from './supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getSession = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createClient()
  if (!supabase) return null
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Unexpected error getting session:', error)
    return null
  }
})

export const getUser = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const session = await getSession()
  if (!session) return null

  const supabase = await createClient()
  if (!supabase) return null
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching profile:', error)
      return session.user
    }

    return {
      ...session.user,
      ...profile
    }
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error)
    return session.user
  }
})

export async function requireUser() {
  if (!isSupabaseConfigured()) {
    throw new Error('Authentication is not configured. Please set up Supabase environment variables.')
  }

  const user = await getUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/login')
  }
  return session
}