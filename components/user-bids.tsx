import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink } from "lucide-react"

export function UserBids() {
  return (
    <div className="space-y-4">
      {userBids.map((bid) => (
        <Card key={bid.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image src={bid.image || "/placeholder.svg"} alt={bid.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{bid.title}</CardTitle>
                  <CardDescription>Bid placed {bid.bidDate}</CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={
                        bid.status === "winning" ? "default" : bid.status === "outbid" ? "destructive" : "secondary"
                      }
                    >
                      {bid.status}
                    </Badge>
                    {bid.timeLeft && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {bid.timeLeft}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Your bid:</p>
                <p className="text-lg font-bold">${bid.yourBid.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Current: ${bid.currentBid.toFixed(2)}</p>
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
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                  Bid Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const userBids = [
  {
    id: "1",
    productId: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "/placeholder.svg?height=80&width=80",
    yourBid: 115.0,
    currentBid: 120.5,
    timeLeft: "2d 4h",
    bidDate: "2 hours ago",
    status: "outbid",
  },
  {
    id: "2",
    productId: "5",
    title: "Antique Bronze Pocket Watch",
    image: "/placeholder.svg?height=80&width=80",
    yourBid: 45.0,
    currentBid: 45.0,
    timeLeft: "12h 30m",
    bidDate: "1 day ago",
    status: "winning",
  },
  {
    id: "3",
    productId: "7",
    title: "Handmade Ceramic Coffee Mug Set",
    image: "/placeholder.svg?height=80&width=80",
    yourBid: 30.0,
    currentBid: 32.5,
    timeLeft: "",
    bidDate: "1 week ago",
    status: "lost",
  },
]
