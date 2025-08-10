import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  title: string
  current_price: number
  is_auction: boolean
  is_buy_now: boolean
  condition: string
  end_date: string
  images: Array<{ url: string }>
  seller: {
    username: string
  }
}

interface ProductGridProps {
  products?: Product[]
}

export function ProductGrid({ products = [] }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-medium">No products found</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const timeLeft = getTimeLeft(product.end_date)
  const mainImage = product.images?.[0]?.url || "/placeholder.svg?height=300&width=300"

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View Product</span>
      </Link>
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={mainImage || "/placeholder.svg"}
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
        {product.condition === "New" && <Badge className="absolute left-2 top-2 bg-blue-600">New</Badge>}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-medium">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">${product.current_price.toFixed(2)}</p>
            {product.is_auction && <p className="text-xs text-gray-500">Auction</p>}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            {product.is_auction && (
              <>
                <Clock className="mr-1 h-3 w-3" />
                {timeLeft}
              </>
            )}
            {product.is_buy_now && !product.is_auction && (
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
