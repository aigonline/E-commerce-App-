"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUserProfile(userId?: string) {
  if (!isSupabaseConfigured()) {
    // Return mock profile for demo
    return {
      id: "demo",
      username: "demo_user",
      full_name: "Demo User",
      bio: "This is a demo profile",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      rating: 4.8,
      total_ratings: 156,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    }
  }

  const supabase = await createClient()
  if (!supabase) return null

  let targetUserId = userId

  if (!targetUserId) {
    const user = await getUser()
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

export async function getUserListings(userId?: string) {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createClient()
  if (!supabase) return []

  let targetUserId = userId

  if (!targetUserId) {
    const user = await getUser()
    if (!user) return []
    targetUserId = user.id
  }

  const { data: listings, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      current_price,
      starting_price,
      status,
      end_date,
      is_auction,
      is_buy_now,
      views,
      created_at,
      images:product_images(url),
      bids:bids(amount)
    `)
    .eq("seller_id", targetUserId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user listings:", error)
    return []
  }

  // Calculate bid count for each listing
  return (listings || []).map(listing => ({
    ...listing,
    bid_count: listing.bids?.length || 0,
    bids: undefined, // Remove the bids array to keep response clean
  }))
}

export async function getUserBids(userId?: string) {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createClient()
  if (!supabase) return []

  let targetUserId = userId

  if (!targetUserId) {
    const user = await getUser()
    if (!user) return []
    targetUserId = user.id
  }

  const { data: bids, error } = await supabase
    .from("bids")
    .select(`
      id,
      amount,
      created_at,
      product:products(
        id,
        title,
        current_price,
        end_date,
        status,
        images:product_images(url)
      )
    `)
    .eq("bidder_id", targetUserId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user bids:", error)
    return []
  }

  return bids || []
}

export async function getUserWatchlist(userId?: string) {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = await createClient()
  if (!supabase) return []

  let targetUserId = userId

  if (!targetUserId) {
    const user = await getUser()
    if (!user) return []
    targetUserId = user.id
  }

  const { data: watchlist, error } = await supabase
    .from("watchlist")
    .select(`
      id,
      created_at,
      product:products(
        id,
        title,
        current_price,
        end_date,
        status,
        is_auction,
        images:product_images(url),
        seller:profiles!seller_id(
          username,
          full_name
        )
      )
    `)
    .eq("user_id", targetUserId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching watchlist:", error)
    return []
  }

  return watchlist || []
}

export async function addToWatchlist(productId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Watchlist is not available in demo mode")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize database connection")
  }

  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to add items to your watchlist")
  }

  // Check if already in watchlist
  const { data: existing } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    // Remove from watchlist
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("id", existing.id)

    if (error) {
      throw new Error("Failed to remove from watchlist")
    }

    revalidatePath(`/products/${productId}`)
    revalidatePath("/profile/watchlist")
    return { success: true, action: "removed", message: "Removed from watchlist" }
  } else {
    // Add to watchlist
    const { error } = await supabase
      .from("watchlist")
      .insert({
        user_id: user.id,
        product_id: productId,
      })

    if (error) {
      throw new Error("Failed to add to watchlist")
    }

    revalidatePath(`/products/${productId}`)
    revalidatePath("/profile/watchlist")
    return { success: true, action: "added", message: "Added to watchlist" }
  }
}

export async function removeFromWatchlist(watchlistId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Watchlist is not available in demo mode")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize database connection")
  }

  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to manage your watchlist")
  }

  // Verify ownership
  const { data: item, error: fetchError } = await supabase
    .from("watchlist")
    .select("user_id")
    .eq("id", watchlistId)
    .single()

  if (fetchError || !item) {
    throw new Error("Watchlist item not found")
  }

  if (item.user_id !== user.id) {
    throw new Error("You can only remove items from your own watchlist")
  }

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("id", watchlistId)

  if (error) {
    throw new Error("Failed to remove from watchlist")
  }

  revalidatePath("/profile/watchlist")
  return { success: true, message: "Removed from watchlist" }
}

export async function isInWatchlist(productId: string) {
  if (!isSupabaseConfigured()) {
    return false
  }

  const supabase = await createClient()
  if (!supabase) return false

  const user = await getUser()
  if (!user) return false

  const { data } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle()

  return !!data
}

export async function updateProfile(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Profile updates are not available in demo mode")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize database connection")
  }

  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to update your profile")
  }

  const username = formData.get("username") as string
  const fullName = formData.get("full_name") as string
  const bio = formData.get("bio") as string
  const avatar = formData.get("avatar") as File

  let avatarUrl = undefined

  // Handle avatar upload if a new file is provided
  if (avatar && avatar.size > 0) {
    // Validate file type
    if (!avatar.type.startsWith("image/")) {
      throw new Error("Please upload an image file")
    }

    // Validate file size (max 5MB)
    if (avatar.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB")
    }

    const fileExt = avatar.name.split(".").pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar)

    if (uploadError) {
      throw new Error("Failed to upload image")
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName)

    avatarUrl = publicUrl
  }

  // Validate username uniqueness if provided
  if (username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .single()

    if (existing) {
      throw new Error("Username is already taken")
    }
  }

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (username) updateData.username = username
  if (fullName) updateData.full_name = fullName
  if (bio !== undefined) updateData.bio = bio
  if (avatarUrl) updateData.avatar_url = avatarUrl

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id)

  if (error) {
    throw new Error("Failed to update profile")
  }

  revalidatePath("/profile")
  return { success: true, message: "Profile updated successfully" }
}
