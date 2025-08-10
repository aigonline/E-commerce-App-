"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink, TrendingUp, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface UserBid {
  id: string
  productId: string
  title: string
  image: string
  yourBid: number
  currentBid: number
  timeLeft: string
  bidDate: string
  status: "winning" | "outbid" | "ended"
  endDate?: string
}

export function UserBids() {
  const [userBids, setUserBids] = useState<UserBid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user bids
    setTimeout(() => {
      setUserBids(mockUserBids)
      setLoading(false)
    }, 1000)

    // Set up real-time updates for bid status
    const interval = setInterval(() => {
      setUserBids(prev => prev.map(bid => {
        if (bid.endDate) {
          const now = new Date()
          const end = new Date(bid.endDate)
          if (now >= end && bid.status !== "ended") {
            return { ...bid, status: "ended" as const, timeLeft: "Ended" }
          }
        }
        return bid
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeLeft = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return "Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "winning":
        return <TrendingUp className="h-4 w-4" />
      case "outbid":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "winning":
        return "default"
      case "outbid":
        return "destructive"
      case "ended":
        return "secondary"
      default:
        return "secondary"
    }
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

  if (userBids.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bids placed yet</h3>
        <p className="text-gray-500 mb-4">Start bidding on items you're interested in.</p>
        <Button asChild>
          <Link href="/products">Browse Auctions</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userBids.map((bid) => (
        <Card key={bid.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image 
                    src={bid.image || "/placeholder.svg"} 
                    alt={bid.title} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform" 
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg hover:text-rose-600 transition-colors">
                    <Link href={`/products/${bid.productId}`}>{bid.title}</Link>
                  </CardTitle>
                  <CardDescription>Bid placed {bid.bidDate}</CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={getStatusColor(bid.status) as any}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(bid.status)}
                      {bid.status}
                    </Badge>
                    {bid.timeLeft && bid.status !== "ended" && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {bid.endDate ? formatTimeLeft(bid.endDate) : bid.timeLeft}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Your bid:</p>
                <p className="text-lg font-bold">${bid.yourBid.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Current: ${bid.currentBid.toFixed(2)}</p>
                {bid.status === "winning" && (
                  <p className="text-xs text-green-600 font-medium">Leading!</p>
                )}
                {bid.status === "outbid" && (
                  <p className="text-xs text-red-600 font-medium">Outbid by ${(bid.currentBid - bid.yourBid).toFixed(2)}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${bid.productId}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Item
                </Link>
              </Button>
              {bid.status === "outbid" && (
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700" asChild>
                  <Link href={`/products/${bid.productId}#bid`}>
                    Bid Again
                  </Link>
                </Button>
              )}
              {bid.status === "winning" && (
                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  You're Winning!
                </Button>
              )}
              {bid.status === "ended" && (
                <Button size="sm" variant="outline" disabled>
                  Auction Ended
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const mockUserBids: UserBid[] = [
  {
    id: "1",
    productId: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    yourBid: 115.0,
    currentBid: 120.5,
    timeLeft: "2d 4h",
    bidDate: "2 hours ago",
    status: "outbid",
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    productId: "5",
    title: "Antique Bronze Pocket Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
    yourBid: 45.0,
    currentBid: 45.0,
    timeLeft: "1d 2h",
    bidDate: "1 day ago",
    status: "winning",
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    productId: "8",
    title: "Vintage Vinyl Records Collection",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
    yourBid: 150.0,
    currentBid: 175.0,
    timeLeft: "Ended",
    bidDate: "3 days ago",
    status: "ended",
  },
]
