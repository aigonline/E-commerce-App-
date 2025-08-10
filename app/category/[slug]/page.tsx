import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SlidersHorizontal } from "lucide-react"
import { getProducts } from "@/app/actions/products"
import { getCategoryBySlug } from "@/app/actions/categories"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: { slug: string }
  searchParams: {
    sort?: "newest" | "ending" | "price_asc" | "price_desc" | "bids"
    condition?: string[]
    min_price?: string
    max_price?: string
    format?: "auction" | "buy_now" | "all"
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return notFound()
  }

  const {
    sort = "newest",
    condition,
    min_price,
    max_price,
    format,
    page = "1"
  } = await searchParams

  const minPrice = min_price ? Number.parseFloat(min_price) : undefined
  const maxPrice = max_price ? Number.parseFloat(max_price) : undefined
  const currentPage = Number.parseInt(page)

  const { products, count } = await getProducts({
    category: slug,
    sort,
    condition,
    minPrice,
    maxPrice,
    format,
    page: currentPage,
  })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>
        
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
            <p className="text-sm text-gray-500">
              Showing {products.length} of {count} products in {category.name}
            </p>
            <Button variant="outline" size="sm" className="md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <div className="hidden md:block">
              <select className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm">
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
                <option value="ending">Ending soon</option>
                <option value="bids">Most bids</option>
              </select>
            </div>
          </div>
          
          <Separator />
          
          <ProductGrid products={products} />
          
          {products.length === 0 && (
            <div className="py-12 text-center">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
