import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getUser = cache(async () => {
  const supabase = await createClient()
  if (!supabase) throw new Error('Could not create Supabase client')

  // Use getUser() instead of getSession()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) return null

  // Fetch additional profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
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