import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Edit, Eye, Trash2 } from "lucide-react"

export function UserListings() {
  return (
    <div className="space-y-4">
      {userListings.map((listing) => (
        <Card key={listing.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription>Listed {listing.listedDate}</CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={listing.status === "active" ? "default" : "secondary"}>{listing.status}</Badge>
                    {listing.isAuction && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {listing.timeLeft}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${listing.price.toFixed(2)}</p>
                {listing.isAuction && <p className="text-sm text-gray-500">{listing.bids} bids</p>}
                <p className="text-sm text-gray-500">{listing.views} views</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const userListings = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "/placeholder.svg?height=80&width=80",
    price: 120.5,
    bids: 23,
    views: 156,
    timeLeft: "2d 4h",
    listedDate: "3 days ago",
    status: "active",
    isAuction: true,
  },
  {
    id: "2",
    title: "Antique Brass Compass",
    image: "/placeholder.svg?height=80&width=80",
    price: 75.0,
    bids: 8,
    views: 89,
    timeLeft: "1d 12h",
    listedDate: "1 week ago",
    status: "active",
    isAuction: true,
  },
  {
    id: "3",
    title: "Vintage Leather Journal",
    image: "/placeholder.svg?height=80&width=80",
    price: 45.0,
    bids: 0,
    views: 23,
    timeLeft: "",
    listedDate: "2 weeks ago",
    status: "ended",
    isAuction: false,
  },
]
