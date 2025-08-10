import { getProducts } from "@/app/actions/products";
import { ProductGrid } from "@/components/product-grid";

export default async function AuctionsPage() {
  // Fetch only auction products
  const { products, count } = await getProducts({ format: "auction", sort: "ending", limit: 24 });

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-rose-600">Live Auctions</h1>
      <p className="mb-6 text-gray-500">Bid on these hot items before time runs out!</p>
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No live auctions right now. Check back soon!</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
