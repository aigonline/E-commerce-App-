import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Auction {
  id: string
  title: string
  current_price: number
  end_date: string
  images: Array<{ url: string }>
}

interface FeaturedAuctionsProps {
  auctions?: Auction[]
}

export function FeaturedAuctions({ auctions = [] }: FeaturedAuctionsProps) {
  if (!auctions || auctions.length === 0) {
    // Fallback to mock data if no auctions are provided
    auctions = mockAuctions
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {auctions.map((auction) => (
        <div
          key={auction.id}
          className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
        >
          <Link href={`/products/${auction.id}`} className="absolute inset-0 z-10">
            <span className="sr-only">View Product</span>
          </Link>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={auction.images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
              alt={auction.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to watchlist</span>
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                <span>{getTimeLeft(auction.end_date)}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="line-clamp-2 text-base font-medium">{auction.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">${auction.current_price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Current bid</p>
              </div>
              <Badge className="bg-rose-600">Hot</Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getTimeLeft(endDate: string): string {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return "Ended"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

// Mock data for when no auctions are provided
const mockAuctions = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    current_price: 120.5,
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
  {
    id: "3",
    title: "Vintage Leather Messenger Bag - Handcrafted Brown Satchel",
    current_price: 89.0,
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
  {
    id: "5",
    title: "Antique Bronze Pocket Watch with Chain - Working Condition",
    current_price: 45.0,
    end_date: new Date(Date.now() + 12 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
  {
    id: "8",
    title: "Vintage Vinyl Records Collection - 1970s Rock - 20 LPs",
    current_price: 175.0,
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
]
