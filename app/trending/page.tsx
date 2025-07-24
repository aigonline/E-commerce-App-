import { getProducts } from "@/app/actions/products";
import { ProductGrid } from "@/components/product-grid";

export default async function TrendingPage() {
  // Fetch trending products (for demo, sort by views desc)
  const { products, count } = await getProducts({ sort: "newest", limit: 24 });
  // You can adjust the sort or add a 'trending' flag in your DB for more control

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-rose-600">Trending Products</h1>
      <p className="mb-6 text-gray-500">See what's hot and popular right now!</p>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No trending products at the moment.</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
