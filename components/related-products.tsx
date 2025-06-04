import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RelatedProducts() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedProducts.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
        >
          <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
            <span className="sr-only">View Product</span>
          </Link>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
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
          </div>
          <div className="p-4">
            <h3 className="line-clamp-2 text-base font-medium">{product.title}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                {product.isAuction && <p className="text-xs text-gray-500">{product.bids} bids</p>}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                {product.isAuction && (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    {product.timeLeft}
                  </>
                )}
                {!product.isAuction && (
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    Buy Now
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const relatedProducts = [
  {
    id: "related-1",
    title: "Vintage Kodak Instamatic Camera",
    image: "/placeholder.svg?height=300&width=300",
    price: 85.0,
    bids: 15,
    timeLeft: "3d 2h",
    isAuction: true,
  },
  {
    id: "related-2",
    title: "Retro Film Camera Collection",
    image: "/placeholder.svg?height=300&width=300",
    price: 199.99,
    bids: 0,
    timeLeft: "",
    isAuction: false,
  },
  {
    id: "related-3",
    title: "Antique Camera Lens Set",
    image: "/placeholder.svg?height=300&width=300",
    price: 125.0,
    bids: 8,
    timeLeft: "1d 12h",
    isAuction: true,
  },
  {
    id: "related-4",
    title: "Vintage Camera Bag Leather",
    image: "/placeholder.svg?height=300&width=300",
    price: 45.0,
    bids: 3,
    timeLeft: "2d 6h",
    isAuction: true,
  },
]
