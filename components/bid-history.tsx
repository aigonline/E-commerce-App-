"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Crown, Clock, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Bid {
  id: string
  amount: number
  created_at: string
  bidder: {
    username: string
    avatar_url: string
  }
  isWinning?: boolean
  timeAgo?: string
}

interface BidHistoryProps {
  bids: Bid[]
  productId?: string
  isLive?: boolean
}

export function BidHistory({ bids, productId, isLive = false }: BidHistoryProps) {
  const [currentBids, setCurrentBids] = useState<Bid[]>(bids || [])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    setCurrentBids(bids || [])
  }, [bids])

  useEffect(() => {
    if (!isLive) return

    // Simulate real-time bid updates
    const interval = setInterval(() => {
      const shouldUpdate = Math.random() > 0.8 // 20% chance of new bid
      if (shouldUpdate && currentBids.length > 0) {
        const newBid: Bid = {
          id: Date.now().toString(),
          amount: currentBids[0].amount + Math.floor(Math.random() * 10) + 1,
          created_at: new Date().toISOString(),
          bidder: {
            username: `User${Math.floor(Math.random() * 100)}`,
            avatar_url: ""
          },
          isWinning: true,
          timeAgo: "Just now"
        }

        setCurrentBids(prev => {
          const updated = prev.map(bid => ({ ...bid, isWinning: false }))
          return [newBid, ...updated]
        })
        
        setLastUpdate(new Date())
        toast.success(`New bid: $${newBid.amount.toFixed(2)}`, {
          description: `${newBid.bidder.username} placed a bid`,
          duration: 3000,
        })
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [isLive, currentBids])

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const bidTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - bidTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setLastUpdate(new Date())
    toast.success("Bid history refreshed")
  }

  const getBidPosition = (index: number) => {
    if (index === 0) return { label: "Highest", color: "text-green-600", icon: Crown }
    if (index === 1) return { label: "2nd", color: "text-orange-500", icon: TrendingUp }
    if (index === 2) return { label: "3rd", color: "text-yellow-600", icon: TrendingUp }
    return { label: `${index + 1}th`, color: "text-gray-500", icon: TrendingUp }
  }

  if (!currentBids || currentBids.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bid History
          </CardTitle>
          <CardDescription>No bids have been placed yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Be the first to place a bid!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bid History ({currentBids.length})
            </CardTitle>
            <CardDescription>
              {isLive && (
                <span className="flex items-center gap-1 text-green-600">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live updates
                </span>
              )}
              Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Bidder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBids.map((bid, index) => {
                const position = getBidPosition(index)
                const IconComponent = position.icon
                
                return (
                  <TableRow 
                    key={bid.id} 
                    className={index === 0 ? "bg-green-50 border-green-200" : ""}
                  >
                    <TableCell>
                      <div className={`flex items-center gap-1 ${position.color}`}>
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{position.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={bid.bidder.avatar_url} alt={bid.bidder.username} />
                          <AvatarFallback className="text-xs">
                            {bid.bidder.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{bid.bidder.username}</p>
                          {index === 0 && (
                            <p className="text-xs text-green-600 font-medium">Leading bidder</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`font-bold ${index === 0 ? 'text-green-600 text-lg' : ''}`}>
                          ${bid.amount.toFixed(2)}
                        </span>
                        {index > 0 && (
                          <span className="text-xs text-gray-500">
                            +${(bid.amount - (currentBids[index + 1]?.amount || 0)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {bid.timeAgo || formatTimeAgo(bid.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge 
                        variant={index === 0 ? "default" : "secondary"}
                        className={index === 0 ? "bg-green-100 text-green-800 border-green-300" : ""}
                      >
                        {index === 0 ? "Winning" : "Outbid"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        
        {currentBids.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All {currentBids.length} Bids
            </Button>
          </div>
        )}
        
        {isLive && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mt-1.5"></div>
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Live Auction</p>
                <p>New bids will appear automatically. You'll be notified of any outbids.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}