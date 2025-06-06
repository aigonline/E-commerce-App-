import { ProductCardSkeleton } from "@/components/product-card-skeleton"

export default function Loading() {
  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="mb-8 h-9 w-48 animate-pulse rounded-md bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}