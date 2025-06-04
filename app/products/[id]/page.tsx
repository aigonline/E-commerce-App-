import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGallery } from "@/components/product-gallery"
import { BidHistory } from "@/components/bid-history"
import { SellerInfo } from "@/components/seller-info"
import { RelatedProducts } from "@/components/related-products"
import { Clock, Heart, Share2, ShieldCheck, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { BidForm } from "@/components/bid-form"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vintage Polaroid SX-70 Land Camera</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Item #</span>
                <span className="font-medium">{params.id}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Condition:</span>
                <span className="font-medium">Used - Excellent</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current bid:</p>
                <p className="text-3xl font-bold">$120.50</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Ends in:</span>
                </div>
                <p className="font-medium text-rose-600">2 days, 4 hours</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              <span>23 bids</span> · <span>First bid was $50.00</span>
            </div>
            <Separator className="my-4" />
            <BidForm />
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
                <p className="mt-2 text-gray-600">
                  This is a vintage Polaroid SX-70 Land Camera in excellent working condition. The camera has been fully
                  refurbished and tested. It comes with the original leather case and manual.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Features</h3>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  <li>Folding SLR design</li>
                  <li>Automatic exposure control</li>
                  <li>Focusing from 10.4 inches to infinity</li>
                  <li>Uses SX-70 film (still available from Polaroid Originals)</li>
                </ul>
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
              <SellerInfo />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bid History</h2>
          <BidHistory />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Similar Items</h2>
          <RelatedProducts />
        </div>
      </div>
    </div>
  )
}
