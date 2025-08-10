"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { placeBid } from "@/app/actions/products"
import { toast } from "sonner"

interface BidFormProps {
  productId: string
  currentPrice: number
  endDate: Date
  minimumBid?: number
  totalBids?: number
  highestBidder?: string
}

export function BidForm({ 
  productId, 
  currentPrice, 
  endDate, 
  minimumBid, 
  totalBids = 0,
  highestBidder 
}: BidFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [quickBidAmounts, setQuickBidAmounts] = useState<number[]>([])
  
  const minBid = minimumBid || currentPrice + 0.01

  useEffect(() => {
    setIsClient(true)
    
    // Set initial bid amount
    setBidAmount(minBid.toFixed(2))
    
    // Generate quick bid amounts
    const quick = [
      minBid,
      minBid + 5,
      minBid + 10,
      minBid + 20
    ]
    setQuickBidAmounts(quick)
    
    // Update timer
    const updateTimer = () => {
      const now = new Date()
      const end = new Date(endDate)
      const diff = end.getTime() - now.getTime()
      
      if (diff <= 0) {
        setIsEnded(true)
        setTimeLeft("Ended")
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [endDate, minBid])

  const validateBid = (amount: number) => {
    if (amount < minBid) {
      return `Minimum bid must be $${minBid.toFixed(2)}`
    }
    if (amount > 10000) {
      return "Maximum bid is $10,000"
    }
    return null
  }

  async function onSubmit(amount: number) {
    try {
      setError("")
      setLoading(true)
      
      const validationError = validateBid(amount)
      if (validationError) {
        setError(validationError)
        return
      }

      const formData = new FormData()
      formData.append("product_id", productId)
      formData.append("amount", amount.toString())
      
      await placeBid(formData)
      
      toast.success(`Bid placed successfully for $${amount.toFixed(2)}!`)
      setBidAmount(minBid.toFixed(2)) // Reset to new minimum
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to place bid"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickBid = (amount: number) => {
    onSubmit(amount)
  }

  const handleCustomBid = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(bidAmount)
    if (!isNaN(amount)) {
      onSubmit(amount)
    }
  }

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Place Your Bid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isEnded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            Auction Ended
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This auction has ended. No more bids can be placed.
              {highestBidder && (
                <div className="mt-2 text-sm">
                  Winner: <span className="font-semibold">{highestBidder}</span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Place Your Bid
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {totalBids} {totalBids === 1 ? 'bid' : 'bids'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {timeLeft}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Price Display */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Current Highest Bid</p>
          <p className="text-3xl font-bold text-rose-600">${currentPrice.toFixed(2)}</p>
          {highestBidder && (
            <p className="text-xs text-gray-500 mt-1">by {highestBidder}</p>
          )}
        </div>

        {/* Quick Bid Buttons */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Quick Bid:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickBidAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => handleQuickBid(amount)}
                disabled={loading}
                className="hover:bg-rose-50 hover:border-rose-300"
              >
                ${amount.toFixed(2)}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Bid Form */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Custom Bid:</p>
          <form onSubmit={handleCustomBid} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min={minBid}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  className="pl-7"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {loading ? "Bidding..." : "Bid"}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Minimum bid: ${minBid.toFixed(2)}</p>
              <p>• You'll only pay if you win</p>
              <p>• Bids are binding commitments</p>
            </div>
          </form>
        </div>

        {/* Bidding Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Bidding Tips:</p>
              <ul className="space-y-1">
                <li>• Bid early to show interest</li>
                <li>• Set your maximum and stick to it</li>
                <li>• Check back near the end</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}