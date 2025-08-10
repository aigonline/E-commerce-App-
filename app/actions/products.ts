"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Mock data for demo purposes when Supabase is not configured
// Using fixed dates to prevent hydration issues
const baseDate = new Date('2025-08-10T00:00:00Z').getTime()
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
    end_date: new Date(baseDate + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 4 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 6 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500&h=500&fit=crop",
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
    end_date: new Date(baseDate + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(baseDate - 8 * 24 * 60 * 60 * 1000).toISOString(),
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
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
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

  const supabase = await createClient()
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
      query = query.eq("is_auction", true).order("current_price", { ascending: false })
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
  try {
    const supabase = await createClient()
    if (!supabase) return null

    // First fetch the product with basic relations
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        seller:profiles(
          id,
          username,
          full_name,
          avatar_url
        ),
        category:categories(
          id,
          name,
          slug
        ),
        images:product_images(
          id,
          url,
          position
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    // Then fetch bids separately
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select(`
        id,
        amount,
        created_at,
        bidder:profiles(
          id,
          username,
          avatar_url
        )
      `)
      .eq("product_id", id)
      .order("created_at", { ascending: false })

    if (bidsError) {
      console.error("Error fetching bids:", bidsError)
    }

    // Combine the data
    return {
      ...product,
      bids: bids || []
    }

  } catch (error) {
    console.error("Unexpected error:", error)
    return null
  }
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

  const supabase = await createClient()
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

export async function getRelatedProducts(currentProductId: string, categoryId: string) {
  if (!isSupabaseConfigured()) {
    // Return mock related products for demo
    return mockProducts.filter(p => p.id !== currentProductId).slice(0, 4)
  }

  const supabase = await createClient()
  if (!supabase) return []

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*)
    `)
    .eq('category_id', categoryId)
    .neq('id', currentProductId)
    .eq('status', 'active')
    .limit(4)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return products || []
}

export async function createProduct(data: {
  title: string
  description: string
  category_id: string
  condition: string
  starting_price: number
  buy_now_price?: number | null
  end_date: Date
  images: string[]
}) {
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  // Insert the product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      condition: data.condition,
      starting_price: data.starting_price,
      current_price: data.starting_price,
      buy_now_price: data.buy_now_price,
      end_date: data.end_date.toISOString(),
      seller_id: user.id,
      status: 'active',
      is_auction: true,
      is_buy_now: !!data.buy_now_price
    })
    .select()
    .single()

  if (productError) {
    throw productError
  }

  // Insert product images
  if (data.images.length > 0) {
    const { error: imagesError } = await supabase
      .from('product_images')
      .insert(
        data.images.map((url, index) => ({
          product_id: product.id,
          url,
          position: index
        }))
      )

    if (imagesError) {
      // Rollback product creation
      await supabase
        .from('products')
        .delete()
        .match({ id: product.id })
      
      throw imagesError
    }
  }

  revalidatePath('/products')
  return product
}

export async function placeBid(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) throw new Error("Failed to create Supabase client")

  // Get the current user
  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to place a bid")
  }

  const productId = formData.get("product_id") as string
  const amount = Number(formData.get("amount"))

  // Validate the amount
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid bid amount")
  }

  // Get the current product details
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("current_price, end_date, seller_id")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    throw new Error("Product not found")
  }

  // Check if auction has ended
  if (new Date(product.end_date) <= new Date()) {
    throw new Error("This auction has ended")
  }

  // Check if user is not the seller
  if (product.seller_id === user.id) {
    throw new Error("You cannot bid on your own item")
  }

  // Check if bid is high enough
  if (amount <= product.current_price) {
    throw new Error(`Bid must be higher than current price: $${product.current_price}`)
  }

  // Start a transaction
  const { error: transactionError } = await supabase.rpc('place_bid', {
    p_product_id: productId,
    p_bidder_id: user.id,
    p_amount: amount
  })

  if (transactionError) {
    throw new Error(transactionError.message || "Failed to place bid")
  }

  revalidatePath(`/products/${productId}`)
}
export async function addToWatchlist(productId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Please set up your environment variables.")
  }

  const supabase = await createClient()
  if (!supabase) throw new Error("Failed to create Supabase client")

  // Get the session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    redirect("/auth/login");
  }

  if (!user) {
    redirect("/auth/login");
  }

  // Check if already in watchlist
  const { data: existing } = await supabase
    .from("watchlist")
    .select()
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    // Already in watchlist, remove it
    await supabase.from("watchlist").delete().eq("id", existing.id)
  } else {
    // Add to watchlist
    await supabase.from("watchlist").insert({
      user_id: user.id,
      product_id: productId,
    })
  }

  revalidatePath(`/products/${productId}`)
}

export async function isInWatchlist(productId: string) {
  if (!isSupabaseConfigured()) {
    return false
  }

  const supabase = await createClient()
  if (!supabase) return false

  // Get the session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return false
  }

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("watchlist")
    .select()
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle()

  return !!data
}
