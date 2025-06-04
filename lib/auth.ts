import { createServerSupabaseClient, isSupabaseConfigured } from "./supabase"
import { redirect } from "next/navigation"
import { cache } from "react"

export const getSession = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
})

export const getUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  const supabase = createServerSupabaseClient()
  if (!supabase) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return {
    ...session.user,
    ...profile,
  }
})

export async function requireUser() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}
