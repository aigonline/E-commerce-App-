"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function BidForm() {
  const [bidAmount, setBidAmount] = useState("125.00")

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Bid placed!",
      description: `You've placed a bid for $${bidAmount}`,
    })
  }

  return (
    <form onSubmit={handleBid} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Enter your max bid:</span>
          <span>Minimum bid: $125.00</span>
        </div>
        <div className="flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-gray-50 text-gray-500">
            $
          </div>
          <Input
            type="number"
            step="0.01"
            min="125.00"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="rounded-l-none"
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
        Place Bid
      </Button>
    </form>
  )
}
