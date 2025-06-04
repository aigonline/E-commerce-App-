import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

interface Product {
  id: string
  title: string
  image: string
  price: number
  bids: number
  timeLeft: string
  isAuction: boolean
  isBuyNow: boolean
  isNew?: boolean
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
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
        {product.isNew && <Badge className="absolute left-2 top-2 bg-blue-600">New</Badge>}
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
            {product.isBuyNow && !product.isAuction && (
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                Buy Now
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const products: Product[] = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "/placeholder.svg?height=300&width=300",
    price: 120.5,
    bids: 23,
    timeLeft: "2d 4h",
    isAuction: true,
    isBuyNow: false,
  },
  {
    id: "2",
    title: "Apple iPhone 13 Pro - 256GB - Sierra Blue (Unlocked)",
    image: "/placeholder.svg?height=300&width=300",
    price: 799.99,
    bids: 0,
    timeLeft: "",
    isAuction: false,
    isBuyNow: true,
    isNew: true,
  },
  {
    id: "3",
    title: "Vintage Leather Messenger Bag - Handcrafted Brown Satchel",
    image: "/placeholder.svg?height=300&width=300",
    price: 89.0,
    bids: 12,
    timeLeft: "1d 6h",
    isAuction: true,
    isBuyNow: true,
  },
  {
    id: "4",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    image: "/placeholder.svg?height=300&width=300",
    price: 249.99,
    bids: 0,
    timeLeft: "",
    isAuction: false,
    isBuyNow: true,
  },
  {
    id: "5",
    title: "Antique Bronze Pocket Watch with Chain - Working Condition",
    image: "/placeholder.svg?height=300&width=300",
    price: 45.0,
    bids: 8,
    timeLeft: "12h 30m",
    isAuction: true,
    isBuyNow: false,
  },
  {
    id: "6",
    title: "Nintendo Switch OLED Model with White Joy-Con",
    image: "/placeholder.svg?height=300&width=300",
    price: 349.99,
    bids: 0,
    timeLeft: "",
    isAuction: false,
    isBuyNow: true,
    isNew: true,
  },
  {
    id: "7",
    title: "Handmade Ceramic Coffee Mug Set - 4 Pieces",
    image: "/placeholder.svg?height=300&width=300",
    price: 32.5,
    bids: 5,
    timeLeft: "3d 8h",
    isAuction: true,
    isBuyNow: false,
  },
  {
    id: "8",
    title: "Vintage Vinyl Records Collection - 1970s Rock - 20 LPs",
    image: "/placeholder.svg?height=300&width=300",
    price: 175.0,
    bids: 18,
    timeLeft: "1d 2h",
    isAuction: true,
    isBuyNow: false,
  },
]
