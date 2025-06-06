import { getProducts } from "@/app/actions/products"
import { ProductGrid } from "@/components/product-grid"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params

  const { products, count } = await getProducts({
    category: slug,
    sort: "newest",
  })

  if (!products.length) {
    notFound()
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="mb-8 text-3xl font-bold capitalize">{slug.replace("-", " ")}</h1>
      <ProductGrid products={products} />
    </div>
  )
}