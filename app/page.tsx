import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { CategoryNav } from "@/components/category-nav"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, TrendingUp } from "lucide-react"
import { getProducts } from "@/app/actions/products"

export default async function Home() {
  // Get featured products for the home page
  const { products: featuredProducts } = await getProducts({
    limit: 8,
    sort: "newest",
  })

  // Get auction products ending soon
  const { products: auctionProducts } = await getProducts({
    limit: 4,
    sort: "ending",
    format: "auction",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl">
                    Discover, Bid, Win on <span className="text-rose-600">BidBay</span>
                  </h1>
                  <p className="max-w-[600px] text-base text-gray-500 sm:text-lg md:text-xl">
                    Your marketplace for unique finds and amazing deals. Join thousands of buyers and sellers on our
                    trusted platform.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row min-[400px]:gap-4">
                  <Link href="/products">
                    <Button size="lg" className="w-full min-[400px]:w-auto bg-rose-600 hover:bg-rose-700">
                      Explore Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sell">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Start Selling
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center order-first lg:order-last">
                <div className="relative h-[280px] w-full sm:h-[320px] md:h-[380px] lg:h-[450px]">
                    <div className="absolute right-0 top-0 h-full w-full rounded-lg bg-gradient-to-br from-rose-100 to-rose-50 p-4 sm:p-6 overflow-hidden">
                    <div className="absolute bottom-4 left-4 right-4 top-4 sm:bottom-6 sm:left-6 sm:right-6 sm:top-6 rounded-lg bg-white shadow-lg">
                      <div className="p-3 sm:p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-rose-100 flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-rose-600" />
                        </div>
                        <span className="text-sm sm:text-base font-medium">Featured Auction</span>
                        </div>
                        <div className="flex items-center space-x-1 rounded-full bg-rose-50 px-2 py-1 text-xs text-rose-600">
                        <Clock className="h-3 w-3" />
                        <span>Ending soon</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center aspect-[4/3] w-full rounded-md bg-gray-100"></div>
                      <div className="mt-3">
                        <h3 className="text-sm sm:text-base font-medium">Vintage Camera Collection</h3>
                        <div className="mt-1 flex items-center justify-between">
                        <span className="text-base sm:text-lg font-bold">$120.50</span>
                        <span className="text-xs sm:text-sm text-gray-500">23 bids</span>
                        </div>
                      </div>
                      </div>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-t border-gray-200 bg-white py-8 sm:py-10 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:items-center md:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Shop by Category</h2>
                <p className="text-sm sm:text-base text-gray-500">Find exactly what you're looking for</p>
              </div>
              <Link href="/categories" className="flex items-center text-rose-600 hover:underline text-sm sm:text-base">
                View all categories
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CategoryNav />
          </div>
        </section>

        {/* Featured Auctions */}
        <section className="border-t border-gray-200 bg-gray-50 py-8 sm:py-10 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:items-center md:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Featured Auctions</h2>
                <p className="text-sm sm:text-base text-gray-500">Don't miss these hot items ending soon</p>
              </div>
              <Link href="/auctions" className="flex items-center text-rose-600 hover:underline text-sm sm:text-base">
                View all auctions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <FeaturedAuctions auctions={auctionProducts} />
          </div>
        </section>

        {/* Popular Products */}
        <section className="border-t border-gray-200 bg-white py-8 sm:py-10 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:items-center md:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Popular Right Now</h2>
                <p className="text-sm sm:text-base text-gray-500">Trending products our users love</p>
              </div>
              <Link href="/trending" className="flex items-center text-rose-600 hover:underline text-sm sm:text-base">
                View all trending
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6">
              <ProductGrid products={featuredProducts} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
