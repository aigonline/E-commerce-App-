import { getProducts } from "@/app/actions/products";
import { ProductGrid } from "@/components/product-grid";
import { notFound } from "next/navigation";
import Link from "next/link";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;

  const { products, count } = await getProducts({
    category: id,
    sort: "newest",
  });

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
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
            <path d="M15 12l-6-6-6 6"/>
          </svg>
          All Categories
        </Link>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 shadow-lg p-6 md:p-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}