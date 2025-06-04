import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturedAuctions() {
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
              src={auction.image || "/placeholder.svg"}
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
                <span>{auction.timeLeft}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="line-clamp-2 text-base font-medium">{auction.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">${auction.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{auction.bids} bids</p>
              </div>
              {auction.isHot && <Badge className="bg-rose-600">Hot</Badge>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const auctions = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "/placeholder.svg?height=300&width=300",
    price: 120.5,
    bids: 23,
    timeLeft: "2d 4h",
    isHot: true,
  },
  {
    id: "3",
    title: "Vintage Leather Messenger Bag - Handcrafted Brown Satchel",
    image: "/placeholder.svg?height=300&width=300",
    price: 89.0,
    bids: 12,
    timeLeft: "1d 6h",
    isHot: false,
  },
  {
    id: "5",
    title: "Antique Bronze Pocket Watch with Chain - Working Condition",
    image: "/placeholder.svg?height=300&width=300",
    price: 45.0,
    bids: 8,
    timeLeft: "12h 30m",
    isHot: true,
  },
  {
    id: "8",
    title: "Vintage Vinyl Records Collection - 1970s Rock - 20 LPs",
    image: "/placeholder.svg?height=300&width=300",
    price: 175.0,
    bids: 18,
    timeLeft: "1d 2h",
    isHot: false,
  },
]
