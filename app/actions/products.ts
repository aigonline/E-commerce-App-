"use server"

import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Mock data for demo purposes when Supabase is not configured
const mockProducts = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    description: "This is a vintage Polaroid SX-70 Land Camera in excellent working condition.",
    current_price: 120.5,
    starting_price: 100.0,
    buy_now_price: 200.0,
    is_auction: true,
    is_buy_now: true,
    condition: "Used - Excellent",
    status: "active",
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 156,
    seller: {
      id: "demo",
      username: "vintage_collector_92",
      full_name: "Demo User",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      rating: 4.8,
    },
    category: {
      id: "cameras",
      name: "Cameras",
      slug: "cameras",
    },
    images: [
      {
        id: "1",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "2",
    title: "Apple iPhone 13 Pro - 256GB - Sierra Blue (Unlocked)",
    description: "Brand new, unopened Apple iPhone 13 Pro with 256GB storage in Sierra Blue.",
    current_price: 799.99,
    starting_price: 799.99,
    buy_now_price: null,
    is_auction: false,
    is_buy_now: true,
    condition: "New",
    status: "active",
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 89,
    seller: {
      id: "demo",
      username: "tech_seller",
      full_name: "Tech Seller",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
      rating: 4.9,
    },
    category: {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
    },
    images: [
      {
        id: "2",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "3",
    title: "Vintage Leather Messenger Bag - Handcrafted Brown Satchel",
    description: "Handcrafted genuine leather messenger bag in rich brown color.",
    current_price: 89.0,
    starting_price: 50.0,
    buy_now_price: 120.0,
    is_auction: true,
    is_buy_now: true,
    condition: "New",
    status: "active",
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 67,
    seller: {
      id: "demo",
      username: "leather_craft",
      full_name: "Leather Crafter",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=leather",
      rating: 4.7,
    },
    category: {
      id: "fashion",
      name: "Fashion",
      slug: "fashion",
    },
    images: [
      {
        id: "3",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "4",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation, exceptional sound quality, and long battery life.",
    current_price: 249.99,
    starting_price: 249.99,
    buy_now_price: null,
    is_auction: false,
    is_buy_now: true,
    condition: "New",
    status: "active",
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 234,
    seller: {
      id: "demo",
      username: "audio_expert",
      full_name: "Audio Expert",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=audio",
      rating: 4.9,
    },
    category: {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
    },
    images: [
      {
        id: "4",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "5",
    title: "Antique Bronze Pocket Watch with Chain - Working Condition",
    description: "Beautiful antique bronze pocket watch with intricate engravings.",
    current_price: 45.0,
    starting_price: 30.0,
    buy_now_price: null,
    is_auction: true,
    is_buy_now: false,
    condition: "Used - Good",
    status: "active",
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 78,
    seller: {
      id: "demo",
      username: "antique_collector",
      full_name: "Antique Collector",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=antique",
      rating: 4.6,
    },
    category: {
      id: "collectibles",
      name: "Collectibles",
      slug: "collectibles",
    },
    images: [
      {
        id: "5",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "6",
    title: "Nintendo Switch OLED Model with White Joy-Con",
    description: "Brand new Nintendo Switch OLED Model with enhanced screen and white Joy-Con controllers.",
    current_price: 349.99,
    starting_price: 349.99,
    buy_now_price: null,
    is_auction: false,
    is_buy_now: true,
    condition: "New",
    status: "active",
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 312,
    seller: {
      id: "demo",
      username: "game_store",
      full_name: "Game Store",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=game",
      rating: 4.9,
    },
    category: {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
    },
    images: [
      {
        id: "6",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "7",
    title: "Handmade Ceramic Coffee Mug Set - 4 Pieces",
    description: "Set of 4 handmade ceramic coffee mugs in assorted colors. Each piece is unique.",
    current_price: 32.5,
    starting_price: 25.0,
    buy_now_price: null,
    is_auction: true,
    is_buy_now: false,
    condition: "New",
    status: "active",
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 45,
    seller: {
      id: "demo",
      username: "ceramic_artist",
      full_name: "Ceramic Artist",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ceramic",
      rating: 4.7,
    },
    category: {
      id: "home",
      name: "Home & Garden",
      slug: "home-garden",
    },
    images: [
      {
        id: "7",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
  {
    id: "8",
    title: "Vintage Vinyl Records Collection - 1970s Rock - 20 LPs",
    description: "Collection of 20 vinyl records from the 1970s rock era. All in good playing condition.",
    current_price: 175.0,
    starting_price: 100.0,
    buy_now_price: null,
    is_auction: true,
    is_buy_now: false,
    condition: "Used - Good",
    status: "active",
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    views: 89,
    seller: {
      id: "demo",
      username: "vinyl_enthusiast",
      full_name: "Vinyl Enthusiast",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=vinyl",
      rating: 4.8,
    },
    category: {
      id: "music",
      name: "Music",
      slug: "music",
    },
    images: [
      {
        id: "8",
        url: "/placeholder.svg?height=500&width=500",
        position: 0,
      },
    ],
  },
]

export async function getProducts({
  category,
  sort = "newest",
  condition,
  minPrice,
  maxPrice,
  format,
  limit = 24,
  page = 1,
}: {
  category?: string
  sort?: "newest" | "ending" | "price_asc" | "price_desc" | "bids"
  condition?: string[]
  minPrice?: number
  maxPrice?: number
  format?: "auction" | "buy_now" | "all"
  limit?: number
  page?: number
}) {
  if (!isSupabaseConfigured()) {
    // Return mock data for demo
    let filteredProducts = [...mockProducts]

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category.slug === category)
    }

    if (condition && condition.length > 0) {
      filteredProducts = filteredProducts.filter((p) => condition.includes(p.condition))
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.current_price >= minPrice)
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.current_price <= maxPrice)
    }

    if (format === "auction") {
      filteredProducts = filteredProducts.filter((p) => p.is_auction)
    } else if (format === "buy_now") {
      filteredProducts = filteredProducts.filter((p) => p.is_buy_now)
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "ending":
        filteredProducts.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
        break
      case "price_asc":
        filteredProducts.sort((a, b) => a.current_price - b.current_price)
        break
      case "price_desc":
        filteredProducts.sort((a, b) => b.current_price - a.current_price)
        break
    }

    // Apply pagination
    const start = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(start, start + limit)

    return { products: paginatedProducts, count: filteredProducts.length }
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) return { products: [], count: 0 }

  let query = supabase
    .from("products")
    .select(
      `
      *,
      seller:profiles!seller_id(*),
      category:categories(*),
      images:product_images(*)
    `,
      { count: "exact" },
    )
    .eq("status", "active")

  // Apply filters
  if (category) {
    query = query.eq("category.slug", category)
  }

  if (condition && condition.length > 0) {
    query = query.in("condition", condition)
  }

  if (minPrice !== undefined) {
    query = query.gte("current_price", minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte("current_price", maxPrice)
  }

  if (format === "auction") {
    query = query.eq("is_auction", true)
  } else if (format === "buy_now") {
    query = query.eq("is_buy_now", true)
  }

  // Apply sorting
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "ending":
      query = query.order("end_date", { ascending: true })
      break
    case "price_asc":
      query = query.order("current_price", { ascending: true })
      break
    case "price_desc":
      query = query.order("current_price", { ascending: false })
      break
    case "bids":
      query = query.eq("is_auction", true).order("bids.count", { ascending: false })
      break
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return { products: [], count: 0 }
  }

  return { products: data || [], count: count || 0 }
}

export async function getProductById(id: string) {
  if (!isSupabaseConfigured()) {
    // Return mock data for demo
    return mockProducts.find((p) => p.id === id) || null
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      seller:profiles!seller_id(*),
      category:categories(*),
      images:product_images(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function getBidHistory(productId: string) {
  if (!isSupabaseConfigured()) {
    // Return mock bid history
    return [
      {
        id: "1",
        amount: 120.5,
        created_at: "2025-06-02T21:45:00Z",
        bidder: {
          username: "j***n",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bidder1",
        },
      },
      {
        id: "2",
        amount: 115.0,
        created_at: "2025-06-02T20:30:00Z",
        bidder: {
          username: "s***h",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bidder2",
        },
      },
    ]
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("bids")
    .select(`
      *,
      bidder:profiles!bidder_id(username, avatar_url)
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bid history:", error)
    return []
  }

  return data || []
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  if (!isSupabaseConfigured()) {
    // Return mock related products
    return mockProducts.filter((p) => p.id !== productId).slice(0, limit)
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      seller:profiles!seller_id(*),
      images:product_images(*)
    `)
    .eq("category_id", categoryId)
    .eq("status", "active")
    .neq("id", productId)
    .limit(limit)

  if (error) {
    console.error("Error fetching related products:", error)
    return []
  }

  return data || []
}

export async function createProduct(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) throw new Error("Failed to create Supabase client")

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const categoryId = formData.get("category") as string
  const condition = formData.get("condition") as string
  const startingPrice = Number.parseFloat(formData.get("starting_price") as string)
  const buyNowPrice = formData.get("buy_now_price") ? Number.parseFloat(formData.get("buy_now_price") as string) : null
  const isAuction = formData.get("is_auction") === "on"
  const isBuyNow = formData.get("is_buy_now") === "on" || !!buyNowPrice
  const duration = Number.parseInt(formData.get("duration") as string)

  // Calculate end date
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + duration)

  // Insert the product
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      title,
      description,
      seller_id: session.user.id,
      category_id: categoryId,
      condition,
      starting_price: startingPrice,
      current_price: startingPrice,
      buy_now_price: buyNowPrice,
      is_auction: isAuction,
      is_buy_now: isBuyNow,
      end_date: endDate.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }

  revalidatePath("/products")
  redirect(`/products/${product.id}`)
}

export async function placeBid(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) throw new Error("Failed to create Supabase client")

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const productId = formData.get("product_id") as string
  const amount = Number.parseFloat(formData.get("amount") as string)

  // Insert the bid
  const { error } = await supabase.from("bids").insert({
    product_id: productId,
    bidder_id: session.user.id,
    amount,
  })

  if (error) {
    console.error("Error placing bid:", error)
    throw new Error(error.message || "Failed to place bid")
  }

  revalidatePath(`/products/${productId}`)
}

export async function addToWatchlist(productId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) throw new Error("Failed to create Supabase client")

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check if already in watchlist
  const { data: existing } = await supabase
    .from("watchlist")
    .select()
    .eq("user_id", session.user.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    // Already in watchlist, remove it
    await supabase.from("watchlist").delete().eq("id", existing.id)
  } else {
    // Add to watchlist
    await supabase.from("watchlist").insert({
      user_id: session.user.id,
      product_id: productId,
    })
  }

  revalidatePath(`/products/${productId}`)
}

export async function isInWatchlist(productId: string) {
  if (!isSupabaseConfigured()) {
    return false
  }

  const supabase = createServerSupabaseClient()
  if (!supabase) return false

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  const { data } = await supabase
    .from("watchlist")
    .select()
    .eq("user_id", session.user.id)
    .eq("product_id", productId)
    .maybeSingle()

  return !!data
}
