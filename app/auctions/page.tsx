import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/app/actions/products"
import { SortDropdown } from "@/components/sort-dropdown"
import { MobileFilters } from "@/components/mobile-filters"
import { ProductPagination } from "@/components/product-pagination"
import { Gavel, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

interface AuctionsPageProps {
  searchParams: {
    q?: string
    category?: string
    sort?: "newest" | "ending" | "price_asc" | "price_desc" | "bids"
    condition?: string[]
    min_price?: string
    max_price?: string
    page?: string
  }
}

export default async function AuctionsPage({ searchParams }: AuctionsPageProps) {
  const params = await searchParams
  
  const { q, category, sort = "ending", condition, min_price, max_price, page = "1" } = params

  const minPrice = min_price ? Number.parseFloat(min_price) : undefined
  const maxPrice = max_price ? Number.parseFloat(max_price) : undefined
  const currentPage = Number.parseInt(page)
  const limit = 24

  // Only get auction items
  const { products, count } = await getProducts({
    search: q,
    category,
    sort,
    condition,
    minPrice,
    maxPrice,
    format: "auction", // Force auction only
    page: currentPage,
    limit,
  })

  const totalPages = Math.ceil(count / limit)

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8 lg:py-12">
      <div className="mb-6 md:mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Gavel className="h-6 w-6 text-rose-600" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Live Auctions</h1>
            <Badge className="bg-rose-600 animate-pulse">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
        <SearchBar />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            <ProductFilters />
          </div>
        </div>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
              Showing {products.length} of {count} active auctions
              {q && <span> for "{q}"</span>}
            </p>
            <div className="flex gap-2 order-1 sm:order-2">
              <MobileFilters />
              <SortDropdown currentSort={sort} />
            </div>
          </div>
          <Separator />
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <ProductPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={count}
            />
          )}
        </div>
      </div>
    </div>
  )
}
