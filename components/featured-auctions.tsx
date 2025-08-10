"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Heart, TrendingUp, Eye, Users, Flame, Star } from "lucide-react"
import { toast } from "sonner"

// Safe category helper - inline to avoid import issues
function getCategoryName(category: any): string {
  if (!category) return ""
  if (typeof category === "string") return category
  if (typeof category === "object" && category.name) return category.name
  return ""
}

// Safe seller helper - inline to avoid import issues
function getSellerName(seller: any): string {
  if (!seller) return ""
  if (typeof seller === "string") return seller
  if (typeof seller === "object") {
    return seller.username || seller.full_name || seller.name || ""
  }
  return ""
}

interface Auction {
  id: string
  title: string
  current_price: number
  end_date: string
  images: Array<{ url: string }>
  bids?: number
  views?: number
  category?: any // Allow any type for category
  seller?: string
  isHot?: boolean
  isFeatured?: boolean
  condition?: string
}

interface FeaturedAuctionsProps {
  auctions?: Auction[]
  showHeader?: boolean
  limit?: number
}

export function FeaturedAuctions({ 
  auctions = [], 
  showHeader = true, 
  limit = 8 
}: FeaturedAuctionsProps) {
  const [displayAuctions, setDisplayAuctions] = useState<Auction[]>([])
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const auctionsToShow = auctions.length > 0 ? auctions : mockAuctions
      setDisplayAuctions(auctionsToShow.slice(0, limit))
      setLoading(false)
    }, 1000)

    // Set up real-time price updates
    const interval = setInterval(() => {
      setDisplayAuctions(prev => prev.map(auction => {
        // Random chance of price increase
        if (Math.random() > 0.95) {
          const increase = Math.floor(Math.random() * 10) + 1
          return {
            ...auction,
            current_price: auction.current_price + increase,
            bids: (auction.bids || 0) + 1
          }
        }
        return auction
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [auctions, limit])

  const toggleWatchlist = async (auctionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newWatchlist = new Set(watchlist)
    if (watchlist.has(auctionId)) {
      newWatchlist.delete(auctionId)
      toast.success("Removed from watchlist")
    } else {
      newWatchlist.add(auctionId)
      toast.success("Added to watchlist")
    }
    setWatchlist(newWatchlist)
  }

  const formatTimeLeft = (endDate: string): { text: string; isUrgent: boolean } => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return { text: "Ended", isUrgent: false }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    const isUrgent = diff < 3 * 60 * 60 * 1000 // Less than 3 hours

    if (days > 0) return { text: `${days}d ${hours}h`, isUrgent: false }
    if (hours > 0) return { text: `${hours}h ${minutes}m`, isUrgent }
    return { text: `${minutes}m`, isUrgent: true }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-rose-600" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Auctions</h2>
            <Badge variant="outline" className="border-rose-200 text-rose-700">
              Hot
            </Badge>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayAuctions.map((auction) => {
          const timeLeft = formatTimeLeft(auction.end_date)
          const isInWatchlist = watchlist.has(auction.id)
          
          return (
            <Card
              key={auction.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <Link href={`/products/${auction.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {auction.title}</span>
              </Link>
              
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={auction.images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                  alt={auction.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {auction.isFeatured && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {auction.isHot && (
                    <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
                      <Flame className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                  {auction.condition && (
                    <Badge variant="secondary" className="text-xs">
                      {auction.condition}
                    </Badge>
                  )}
                </div>

                {/* Watchlist button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute right-2 top-2 z-20 h-8 w-8 rounded-full backdrop-blur-sm transition-colors ${
                    isInWatchlist 
                      ? "bg-rose-500 text-white hover:bg-rose-600" 
                      : "bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600"
                  }`}
                  onClick={(e) => toggleWatchlist(auction.id, e)}
                >
                  <Heart className={`h-4 w-4 ${isInWatchlist ? "fill-current" : ""}`} />
                  <span className="sr-only">
                    {isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  </span>
                </Button>

                {/* Time left indicator */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ${
                    timeLeft.isUrgent 
                      ? "bg-red-500/80 animate-pulse" 
                      : "bg-black/60"
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{timeLeft.text}</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {auction.views && (
                    <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      <Eye className="h-3 w-3" />
                      <span>{auction.views}</span>
                    </div>
                  )}
                  {auction.bids && (
                    <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      <Users className="h-3 w-3" />
                      <span>{auction.bids}</span>
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                      {auction.title}
                    </h3>
                  </div>
                  
                  {auction.category && (
                    <p className="text-xs text-gray-500">
                      {getCategoryName(auction.category)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        ${auction.current_price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {auction.bids ? `${auction.bids} bids` : "No bids yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        +{Math.floor(Math.random() * 20)}%
                      </span>
                    </div>
                  </div>
                  
                  {auction.seller && (
                    <p className="text-xs text-gray-500">
                      by <span className="font-medium">{getSellerName(auction.seller)}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {displayAuctions.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions available</h3>
          <p className="text-gray-500">Check back later for new featured auctions.</p>
        </div>
      )}
    </div>
  )
}

// Mock data with enhanced properties  
const baseDate = new Date('2025-08-10T00:00:00Z').getTime()
const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    current_price: 120.5,
    end_date: new Date(baseDate + 2 * 24 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop" }],
    bids: 23,
    views: 156,
    category: "Electronics",
    seller: "VintageCollector",
    isHot: true,
    isFeatured: true,
    condition: "Excellent"
  },
  {
    id: "3",
    title: "Vintage Leather Messenger Bag - Handcrafted Brown Satchel",
    current_price: 89.0,
    end_date: new Date(baseDate + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop" }],
    bids: 8,
    views: 89,
    category: "Fashion",
    seller: "LeatherCraft",
    condition: "Very Good"
  },
  {
    id: "5",
    title: "Antique Bronze Pocket Watch with Chain - Working Condition",
    current_price: 45.0,
    end_date: new Date(baseDate + 2 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop" }],
    bids: 12,
    views: 67,
    category: "Antiques",
    seller: "TimePieces",
    isHot: true,
    condition: "Good"
  },
  {
    id: "8",
    title: "Vintage Vinyl Records Collection - 1970s Rock - 20 LPs",
    current_price: 175.0,
    end_date: new Date(baseDate + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" }],
    bids: 31,
    views: 203,
    category: "Music",
    seller: "VinylVault",
    isFeatured: true,
    condition: "Mint"
  },
  {
    id: "9",
    title: "Retro Gaming Console Bundle - Complete Set",
    current_price: 95.0,
    end_date: new Date(baseDate + 3 * 24 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop" }],
    bids: 15,
    views: 124,
    category: "Gaming",
    seller: "RetroGamer",
    condition: "Good"
  },
  {
    id: "10",
    title: "Handmade Ceramic Coffee Mug Set - Artisan Crafted",
    current_price: 32.5,
    end_date: new Date(baseDate + 1 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop" }],
    bids: 7,
    views: 42,
    category: "Home & Garden",
    seller: "CeramicArt",
    condition: "New"
  }
]
