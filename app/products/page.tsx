import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SlidersHorizontal } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <div className="hidden md:block">
          <div className="sticky top-20">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            <ProductFilters />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1-24 of 256 products</p>
            <Button variant="outline" size="sm" className="md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <div className="hidden md:block">
              <select className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm">
                <option>Newest first</option>
                <option>Price: Low to high</option>
                <option>Price: High to low</option>
                <option>Ending soon</option>
                <option>Most bids</option>
              </select>
            </div>
          </div>
          <Separator />
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
