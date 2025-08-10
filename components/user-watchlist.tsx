"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink, X, Heart } from "lucide-react"
import { toast } from "sonner"

interface WatchlistItem {
  id: string
  title: string
  image: string
  price: number
  bids: number
  timeLeft: string
  addedDate: string
  isAuction: boolean
  endDate?: string
}

export function UserWatchlist() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading watchlist items
    setTimeout(() => {
      setWatchlistItems(mockWatchlistItems)
      setLoading(false)
    }, 1000)
  }, [])

  const removeFromWatchlist = async (itemId: string) => {
    try {
      // In a real app, this would call your API
      setWatchlistItems(prev => prev.filter(item => item.id !== itemId))
      toast.success("Item removed from watchlist")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const formatTimeLeft = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return "Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex gap-4">
                <div className="h-20 w-20 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (watchlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your watchlist is empty</h3>
        <p className="text-gray-500 mb-4">Start adding items you're interested in to keep track of them.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {watchlistItems.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.title} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform" 
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg hover:text-rose-600 transition-colors">
                    <Link href={`/products/${item.id}`}>{item.title}</Link>
                  </CardTitle>
                  <CardDescription>Added {item.addedDate}</CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    {item.isAuction && (
                      <>
                        <Badge variant="outline">Auction</Badge>
                        {item.endDate && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatTimeLeft(item.endDate)}
                          </div>
                        )}
                      </>
                    )}
                    {!item.isAuction && (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Buy Now
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                {item.isAuction && <p className="text-sm text-gray-500">{item.bids} bids</p>}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mt-2 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeFromWatchlist(item.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove from watchlist</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${item.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Item
                </Link>
              </Button>
              {item.isAuction ? (
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700" asChild>
                  <Link href={`/products/${item.id}#bid`}>
                    Place Bid
                  </Link>
                </Button>
              ) : (
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700" asChild>
                  <Link href={`/products/${item.id}#buy`}>
                    Buy Now
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const mockWatchlistItems: WatchlistItem[] = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    price: 120.5,
    bids: 23,
    timeLeft: "2d 4h",
    addedDate: "3 days ago",
    isAuction: true,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Sony WH-1000XM4 Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    price: 249.99,
    bids: 0,
    timeLeft: "",
    addedDate: "1 week ago",
    isAuction: false,
  },
  {
    id: "3",
    title: "Vintage Vinyl Records Collection",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
    price: 175.0,
    bids: 18,
    timeLeft: "1d 2h",
    addedDate: "2 weeks ago",
    isAuction: true,
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
  },
]
