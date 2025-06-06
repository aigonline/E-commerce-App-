import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getSession = cache(async () => {
  const supabase = await createClient()
  if (!supabase) throw new Error('Could not create Supabase client')
  const { data: { session } } = await supabase.auth.getSession()
  return session
})

export const getUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  const supabase = await createClient()
  if (!supabase) throw new Error('Could not create Supabase client')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return {
    ...session.user,
    ...profile
  }
})

export async function requireUser() {
  const user = await getUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}