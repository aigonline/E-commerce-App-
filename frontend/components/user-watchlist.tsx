import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink, X } from "lucide-react"

export function UserWatchlist() {
  return (
    <div className="space-y-4">
      {watchlistItems.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>Added {item.addedDate}</CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    {item.isAuction && (
                      <>
                        <Badge variant="outline">Auction</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-3 w-3" />
                          {item.timeLeft}
                        </div>
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
                <Button variant="ghost" size="icon" className="mt-2">
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
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                  Place Bid
                </Button>
              ) : (
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                  Buy Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const watchlistItems = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "/placeholder.svg?height=80&width=80",
    price: 120.5,
    bids: 23,
    timeLeft: "2d 4h",
    addedDate: "3 days ago",
    isAuction: true,
  },
  {
    id: "2",
    title: "Sony WH-1000XM4 Wireless Headphones",
    image: "/placeholder.svg?height=80&width=80",
    price: 249.99,
    bids: 0,
    timeLeft: "",
    addedDate: "1 week ago",
    isAuction: false,
  },
  {
    id: "3",
    title: "Vintage Vinyl Records Collection",
    image: "/placeholder.svg?height=80&width=80",
    price: 175.0,
    bids: 18,
    timeLeft: "1d 2h",
    addedDate: "2 weeks ago",
    isAuction: true,
  },
]
