"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function placeBid(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Bidding is not available in demo mode. Please configure Supabase.")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize database connection")
  }

  // Get the current user
  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to place a bid")
  }

  const productId = formData.get("product_id") as string
  const amount = Number(formData.get("amount"))

  // Validate inputs
  if (!productId) {
    throw new Error("Product ID is required")
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid bid amount")
  }

  // Get the current product details
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      current_price,
      starting_price,
      buy_now_price,
      end_date,
      seller_id,
      status,
      is_auction
    `)
    .eq("id", productId)
    .single()

  if (productError || !product) {
    throw new Error("Product not found")
  }

  // Validation checks
  if (!product.is_auction) {
    throw new Error("This item is not available for auction")
  }

  if (product.status !== "active") {
    throw new Error("This auction is no longer active")
  }

  if (new Date(product.end_date) <= new Date()) {
    throw new Error("This auction has ended")
  }

  if (product.seller_id === user.id) {
    throw new Error("You cannot bid on your own item")
  }

  if (amount <= product.current_price) {
    throw new Error(`Bid must be higher than current price: $${product.current_price.toFixed(2)}`)
  }

  // Check for buy now price
  if (product.buy_now_price && amount >= product.buy_now_price) {
    throw new Error(`Bid amount meets or exceeds Buy Now price. Use Buy Now option instead.`)
  }

  // Get the highest bid to ensure we're not outbid
  const { data: highestBid } = await supabase
    .from("bids")
    .select("amount")
    .eq("product_id", productId)
    .order("amount", { ascending: false })
    .limit(1)
    .single()

  if (highestBid && amount <= highestBid.amount) {
    throw new Error(`Bid must be higher than current highest bid: $${highestBid.amount.toFixed(2)}`)
  }

  try {
    // Start transaction by inserting the bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert({
        product_id: productId,
        bidder_id: user.id,
        amount: amount,
      })
      .select()
      .single()

    if (bidError) {
      throw new Error(bidError.message)
    }

    // Update the product's current price (this is handled by the database trigger)
    // But we'll also do it explicitly to ensure consistency
    const { error: updateError } = await supabase
      .from("products")
      .update({
        current_price: amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)

    if (updateError) {
      // If updating the product fails, try to remove the bid
      await supabase.from("bids").delete().eq("id", bid.id)
      throw new Error("Failed to update product price")
    }

    revalidatePath(`/products/${productId}`)
    return { success: true, message: "Bid placed successfully!" }

  } catch (error) {
    console.error("Error placing bid:", error)
    throw error
  }
}

export async function buyNow(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Buy Now is not available in demo mode. Please configure Supabase.")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize database connection")
  }

  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to buy items")
  }

  const productId = formData.get("product_id") as string

  if (!productId) {
    throw new Error("Product ID is required")
  }

  // Get product details
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      buy_now_price,
      seller_id,
      status,
      is_buy_now,
      title
    `)
    .eq("id", productId)
    .single()

  if (productError || !product) {
    throw new Error("Product not found")
  }

  // Validation checks
  if (!product.is_buy_now || !product.buy_now_price) {
    throw new Error("This item is not available for immediate purchase")
  }

  if (product.status !== "active") {
    throw new Error("This item is no longer available")
  }

  if (product.seller_id === user.id) {
    throw new Error("You cannot buy your own item")
  }

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        seller_id: product.seller_id,
        product_id: productId,
        amount: product.buy_now_price,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      throw new Error("Failed to create order")
    }

    // Update product status to sold
    const { error: updateError } = await supabase
      .from("products")
      .update({
        status: "sold",
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)

    if (updateError) {
      // Rollback order creation
      await supabase.from("orders").delete().eq("id", order.id)
      throw new Error("Failed to update product status")
    }

    revalidatePath(`/products/${productId}`)
    revalidatePath("/profile/orders")
    
    return { 
      success: true, 
      message: "Purchase successful! Check your orders for details.",
      orderId: order.id 
    }

  } catch (error) {
    console.error("Error processing buy now:", error)
    throw error
  }
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

export async function getUserOrders(userId?: string) {
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

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      amount,
      status,
      created_at,
      tracking_number,
      product:products(
        id,
        title,
        images:product_images(url)
      ),
      seller:profiles!seller_id(
        username,
        full_name
      )
    `)
    .eq("buyer_id", targetUserId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error)
    return []
  }

  return orders || []
}

export async function getUserSales(userId?: string) {
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

  const { data: sales, error } = await supabase
    .from("orders")
    .select(`
      id,
      amount,
      status,
      created_at,
      tracking_number,
      product:products(
        id,
        title,
        images:product_images(url)
      ),
      buyer:profiles!buyer_id(
        username,
        full_name
      )
    `)
    .eq("seller_id", targetUserId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user sales:", error)
    return []
  }

  return sales || []
}

export async function updateOrderStatus(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Order management is not available in demo mode")
  }

  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Failed to initialize database connection")
  }

  const user = await getUser()
  if (!user) {
    throw new Error("You must be logged in to update orders")
  }

  const orderId = formData.get("order_id") as string
  const status = formData.get("status") as string
  const trackingNumber = formData.get("tracking_number") as string

  if (!orderId || !status) {
    throw new Error("Order ID and status are required")
  }

  // Verify the user owns this order (as seller)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("seller_id")
    .eq("id", orderId)
    .single()

  if (orderError || !order) {
    throw new Error("Order not found")
  }

  if (order.seller_id !== user.id) {
    throw new Error("You can only update your own sales")
  }

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (trackingNumber) {
    updateData.tracking_number = trackingNumber
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)

  if (updateError) {
    throw new Error("Failed to update order")
  }

  revalidatePath("/profile/sales")
  return { success: true, message: "Order updated successfully" }
}
