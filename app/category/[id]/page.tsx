import { getProducts } from "@/app/actions/products";
import { ProductGrid } from "@/components/product-grid";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: { id: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;
  const { products, count } = await getProducts({ category: id, sort: "newest" });

  if (!products.length) {
    notFound();
  }

  // Capitalize each word in the slug for the title
  const title = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="container mx-auto px-4 py-10 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white capitalize">
            {title}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            {count} {count === 1 ? "product" : "products"} found in this category
          </p>
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
