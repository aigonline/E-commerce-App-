export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="mb-4 h-48 animate-pulse rounded-md bg-gray-200" />
      <div className="space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}