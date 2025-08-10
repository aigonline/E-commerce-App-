"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

// Mock categories for demo purposes
const mockCategories = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Computers, phones, gaming, and more",
    icon: "laptop",
    product_count: 234,
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, accessories",
    icon: "shirt",
    product_count: 156,
  },
  {
    id: "home",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Furniture, decor, tools, and garden supplies",
    icon: "home",
    product_count: 89,
  },
  {
    id: "collectibles",
    name: "Collectibles",
    slug: "collectibles",
    description: "Antiques, art, coins, and rare items",
    icon: "star",
    product_count: 67,
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    description: "Sporting goods and equipment",
    icon: "activity",
    product_count: 78,
  },
  {
    id: "books",
    name: "Books",
    slug: "books",
    description: "New and used books",
    icon: "book",
    product_count: 112,
  },
  {
    id: "music",
    name: "Music",
    slug: "music",
    description: "Instruments, vinyl, CDs, and equipment",
    icon: "music",
    product_count: 45,
  },
  {
    id: "cameras",
    name: "Cameras",
    slug: "cameras",
    description: "Digital cameras, lenses, and photography equipment",
    icon: "camera",
    product_count: 56,
  },
]

export async function getCategories() {
  if (!isSupabaseConfigured()) {
    return mockCategories
  }

  const supabase = await createClient()
  if (!supabase) return mockCategories

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return mockCategories
  }

  return data || mockCategories
}

export async function getCategoryBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return mockCategories.find(cat => cat.slug === slug) || null
  }

  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data
}
