"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { placeBid } from "@/app/actions/products"

interface BidFormProps {
  productId: string
  currentPrice: number
  endDate: Date
  minimumBid?: number
}

export function BidForm({ productId, currentPrice, endDate, minimumBid }: BidFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const minBid = minimumBid || currentPrice + 0.01

  const isEnded = new Date(endDate) <= new Date()

  async function onSubmit(formData: FormData) {
    try {
      setError("")
      setLoading(true)
      
      const amount = Number(formData.get("amount"))
      
      if (amount < minBid) {
        setError(`Minimum bid must be $${minBid.toFixed(2)}`)
        return
      }

      await placeBid(formData)
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to place bid")
    } finally {
      setLoading(false)
    }
  }

  if (isEnded) {
    return (
      <Alert variant="destructive">
        <AlertDescription>This auction has ended</AlertDescription>
      </Alert>
    )
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <input type="hidden" name="product_id" value={productId} />
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              type="number"
              name="amount"
              step="0.01"
              min={minBid}
              defaultValue={minBid.toFixed(2)}
              placeholder="Enter bid amount"
              className="pl-7"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Placing bid..." : "Place Bid"}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-gray-500">
          Enter ${minBid.toFixed(2)} or more
        </p>
      </div>
    </form>
  )
}