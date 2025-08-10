"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication is not configured. Please set up Supabase environment variables.")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize authentication")
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const fullName = formData.get("full_name") as string

  if (!email || !password || !username) {
    throw new Error("Email, password, and username are required")
  }

  // Check if username is already taken
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single()

  if (existingProfile) {
    throw new Error("Username is already taken")
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.user) {
    // Create profile after successful signup
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        username,
        full_name: fullName,
        email: data.user.email,
      })

    if (profileError) {
      console.error("Error creating profile:", profileError)
    }
  }

  revalidatePath("/")
  redirect("/auth/login?message=Check your email to confirm your account")
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication is not configured. Please set up Supabase environment variables.")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize authentication")
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  redirect("/")
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication is not configured")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize authentication")
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  redirect("/")
}

export async function updateProfile(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication is not configured")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize authentication")
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Not authenticated")
  }

  const username = formData.get("username") as string
  const fullName = formData.get("full_name") as string
  const bio = formData.get("bio") as string

  if (username) {
    // Check if username is already taken by another user
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .single()

    if (existingProfile) {
      throw new Error("Username is already taken")
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...(username && { username }),
      ...(fullName && { full_name: fullName }),
      ...(bio && { bio }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/profile")
}

export async function getProfile(userId?: string) {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createClient()
  if (!supabase) return null

  let targetUserId = userId

  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    targetUserId = user.id
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", targetUserId)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return profile
}

export async function resetPassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication is not configured")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize authentication")
  }

  const email = formData.get("email") as string

  if (!email) {
    throw new Error("Email is required")
  }

  const headersList = await headers()
  const origin = headersList.get("origin")

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect("/auth/login?message=Check your email for password reset instructions")
}

export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Authentication is not configured")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize authentication")
  }

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string

  if (!password || !confirmPassword) {
    throw new Error("Password and confirmation are required")
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect("/profile?message=Password updated successfully")
}
