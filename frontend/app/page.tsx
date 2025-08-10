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
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Discover, Bid, Win on <span className="text-rose-600">BidBay</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-800 md:text-xl">
                    Your marketplace for unique finds and amazing deals. Join thousands of buyers and sellers on our
                    trusted platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/products">
                    <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                      Explore Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sell">
                    <Button className="bg-gray-600 text-white px-12"size="lg" variant="outline">
                      Start Selling
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full md:h-[420px] lg:h-[450px]">
                  <div className="flex items-center justify-center absolute right-0 top-0 h-full w-full rounded-lg bg-gradient-to-br from-rose-100 to-rose-50 p-6">
                    <div className=" flex flex-col h-full w-full gap-4  rounded-lg bg-white shadow-lg">
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-rose-600" />
                            </div>
                            <span className="font-medium">Featured Auction</span>
                          </div>
                          <div className="flex items-center space-x-1 rounded-full bg-rose-50 px-2 py-1 text-xs text-rose-600">
                            <Clock className="h-3 w-3" />
                            <span>Ending soon</span>
                          </div>
                        </div>
                        <div className=" flex flex-col gap-7 lg:gap-[4rem]">
                          <img
                            src="/assets/vintage-camera.jpg"
                            alt="Vintage Camera"
                            className="mx-auto mt-6 lg:h-[10rem] border-2 border-rose-500 shadow rounded"
                          />
                          <div>
                            <div className="mt-1 mb-4 flex items-center justify-between p-3 rounded bg-rose-500">
                              <h3 className="font-bold text-sm min-[500px]:text-xl text-white  ">Vintage Camera</h3>
                              <span className="text-md min[500px]:text-lg text-white font-bold">$120.50</span>
                              <span className="text-md font-bold text-green-300">23 bids</span>
                            </div>
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
        <section className="border-t border-gray-200 bg-white py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
                <p className="text-gray-500">Find exactly what you're looking for</p>
              </div>
              <Link href="/categories" className="flex items-center text-rose-600 hover:underline">
                View all categories
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <CategoryNav />
          </div>
        </section>

        {/* Featured Auctions */}
        <section className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Featured Auctions</h2>
                <p className="text-gray-500">Don't miss these hot items ending soon</p>
              </div>
              <Link href="/auctions" className="flex items-center text-rose-600 hover:underline">
                View all auctions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <FeaturedAuctions auctions={auctionProducts} />
          </div>
        </section>

        {/* Popular Products */}
        <section className="border-t border-gray-200 bg-white py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Popular Right Now</h2>
                <p className="text-gray-500">Trending products our users love</p>
              </div>
              <Link href="/trending" className="flex items-center text-rose-600 hover:underline">
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
