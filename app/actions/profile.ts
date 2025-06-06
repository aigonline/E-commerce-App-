"use server"

import { createServerSupabaseClient } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getUserListings() {
  const supabase = createServerSupabaseClient()

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*)
    `)
    .eq("seller_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user listings:", error)
    return []
  }

  return data
}

export async function getUserBids() {
  const supabase = createServerSupabaseClient()

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data, error } = await supabase
    .from("bids")
    .select(`
      *,
      product:products(
        *,
        images:product_images(*)
      )
    `)
    .eq("bidder_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user bids:", error)
    return []
  }

  return data
}

export async function getUserWatchlist() {
  const supabase = createServerSupabaseClient()

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data, error } = await supabase
    .from("watchlist")
    .select(`
      *,
      product:products(
        *,
        images:product_images(*),
        seller:profiles!seller_id(*)
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user watchlist:", error)
    return []
  }

  return data
}

export async function updateProfile(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const username = formData.get("username") as string
  const fullName = formData.get("full_name") as string
  const bio = formData.get("bio") as string
  const avatar = formData.get("avatar") as File

  let avatarUrl = undefined

  // Handle avatar upload if a new file is provided
  if (avatar && avatar.size > 0) {
    const fileExt = avatar.name.split(".").pop()
    const fileName = `${session.user.id}/avatar.${fileExt}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatar, { upsert: true })

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError)
    } else {
      // Get public URL
      const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(fileName)

      avatarUrl = publicUrl.publicUrl
    }
  }

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName,
      bio,
      ...(avatarUrl && { avatar_url: avatarUrl }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }

  revalidatePath("/profile")
}
