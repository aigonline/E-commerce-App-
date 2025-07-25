import { getProductById } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGallery } from "@/components/product-gallery"
import { BidHistory } from "@/components/bid-history"
import { SellerInfo } from "@/components/seller-info"
import { RelatedProducts } from "@/components/related-products"
import { Clock, Heart, Share2, ShieldCheck, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { BidForm } from "@/components/bid-form"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = params.id
  const product = await getProductById(id)
  
  if (!product) {
    return notFound()
  }

  const timeLeft = getTimeLeft(new Date(product.end_date))

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images.map((img: { url: string }) => ({ ...img, alt: `${product.title} - Product image` }))} />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Item #</span>
                <span className="font-medium">{product.id}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Condition:</span>
                <span className="font-medium">{product.condition}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current bid:</p>
                <p className="text-3xl font-bold">${product.current_price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Ends in:</span>
                </div>
                <p className="font-medium text-rose-600">{timeLeft}</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              <span>{product.bids?.length || 0} bids</span>
              {product.starting_price && (
                <> · <span>First bid was ${product.starting_price.toFixed(2)}</span></>
              )}
            </div>
            <Separator className="my-4" />
            <BidForm 
              productId={product.id}
              currentPrice={product.current_price}
              endDate={new Date(product.end_date)}
            />
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Watch
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>


          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span className="font-medium">Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Free shipping</span>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold">Product Description</h3>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
            </TabsContent>
          
            <TabsContent value="shipping" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Shipping Information</h3>
                  <p className="mt-2 text-gray-600">
                    This item ships worldwide. Free standard shipping to the United States. International buyers are
                    responsible for any customs fees.
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-3">
                  <h4 className="font-medium">Estimated Delivery Times</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>United States (Standard)</span>
                      <span>3-5 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>United States (Express)</span>
                      <span>1-2 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>International</span>
                      <span>7-14 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="seller" className="mt-4">
              <SellerInfo seller={product.seller} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bid History</h2>
          <BidHistory bids={product.bids} />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Similar Items</h2>
          <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
        </div>
      </div>
    </div>
  )
}

function getTimeLeft(endDate: Date): string {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}