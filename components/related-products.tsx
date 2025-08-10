"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRelatedProducts } from "@/app/actions/products"
import { getTimeLeft } from "@/lib/utils"

interface Product {
  id: string
  title: string
  current_price: number
  is_auction: boolean
  is_buy_now: boolean
  end_date: string
  images: Array<{ id: string; url: string }>
  bids?: Array<{ id: string; amount: number }>
}

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRelatedProducts() {
      try {
        const relatedProducts = await getRelatedProducts(currentProductId, categoryId)
        setProducts(relatedProducts)
      } catch (error) {
        console.error('Failed to load related products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedProducts()
  }, [categoryId, currentProductId])

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border bg-white p-4">
            <div className="aspect-square bg-gray-200" />
            <div className="mt-4 h-4 w-3/4 bg-gray-200" />
            <div className="mt-2 h-6 w-1/2 bg-gray-200" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="mt-6 rounded-lg border bg-gray-50 p-8 text-center text-gray-500">
        No related products found
      </div>
    )
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
        >
          <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
            <span className="sr-only">View Product</span>
          </Link>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0]?.url || "/placeholder.svg"}
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
                <p className="text-lg font-bold">${product.current_price.toFixed(2)}</p>
                {product.is_auction && (
                  <p className="text-xs text-gray-500">{product.bids?.length || 0} bids</p>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                {product.is_auction && (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    {getTimeLeft(new Date(product.end_date))}
                  </>
                )}
                {product.is_buy_now && (
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