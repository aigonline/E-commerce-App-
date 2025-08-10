import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SlidersHorizontal } from "lucide-react"
import { getProducts } from "@/app/actions/products"

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: "newest" | "ending" | "price_asc" | "price_desc" | "bids"
    condition?: string[]
    min_price?: string
    max_price?: string
    format?: "auction" | "buy_now" | "all"
    page?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  
  const { category, sort = "newest", condition, min_price, max_price, format, page = "1" } = params

  const minPrice = min_price ? Number.parseFloat(min_price) : undefined
  const maxPrice = max_price ? Number.parseFloat(max_price) : undefined
  const currentPage = Number.parseInt(page)

  const { products, count } = await getProducts({
    category,
    sort,
    condition,
    minPrice,
    maxPrice,
    format,
    page: currentPage,
  })

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8 lg:py-12">
      <div className="mb-6 md:mb-8 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Products</h1>
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
              Showing {products.length} of {count} products
            </p>
            <div className="flex gap-2 order-1 sm:order-2">
              <Button variant="outline" size="sm" className="lg:hidden flex-1 sm:flex-none">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <select className="flex-1 sm:flex-none rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm min-w-[140px]">
                <option>Newest first</option>
                <option>Price: Low to high</option>
                <option>Price: High to low</option>
                <option>Ending soon</option>
                <option>Most bids</option>
              </select>
            </div>
          </div>
          <Separator />
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
