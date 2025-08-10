"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Minus, Plus, Trash2, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"

interface CartItem {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  seller: string
  condition: string
  shippingCost: number
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    price: 120.50,
    originalPrice: 150.00,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop",
    quantity: 1,
    seller: "VintageCollector",
    condition: "Used - Excellent",
    shippingCost: 15.99
  },
  {
    id: "2",
    title: "Apple iPhone 13 Pro - 256GB",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
    quantity: 1,
    seller: "TechDeals",
    condition: "New",
    shippingCost: 0
  }
]

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
    toast.success("Item removed from cart")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingTotal = cartItems.reduce((sum, item) => sum + item.shippingCost, 0)
  const total = subtotal + shippingTotal

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-lg font-semibold">Items in Cart ({cartItems.length})</h2>
        
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link 
                        href={`/products/${item.id}`}
                        className="font-medium text-gray-900 hover:text-rose-600 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Sold by {item.seller} • {item.condition}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {item.originalPrice && (
                          <Badge variant="secondary" className="text-xs">
                            Save ${(item.originalPrice - item.price).toFixed(2)}
                          </Badge>
                        )}
                      </div>
                      {item.shippingCost > 0 ? (
                        <p className="text-sm text-gray-500 mt-1">
                          + ${item.shippingCost.toFixed(2)} shipping
                        </p>
                      ) : (
                        <Badge variant="outline" className="text-xs mt-1 w-fit">
                          Free shipping
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="h-8 w-16 border-0 text-center"
                        min="1"
                        type="number"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingTotal === 0 ? (
                    <Badge variant="outline" className="text-xs">Free</Badge>
                  ) : (
                    `$${shippingTotal.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-rose-600 hover:bg-rose-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Secure checkout</span>
            </div>
            
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
