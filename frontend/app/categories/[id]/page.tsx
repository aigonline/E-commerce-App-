import { getProducts } from "@/app/actions/products";

interface CategoryPageProps {
  params: { id: string }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  // Fetch products for this category from your backend
  let products: any[] = [];
  try {
    const result = await getProducts({ category: id }) as { products: any[] };
    products = Array.isArray(result.products) ? result.products : [];
  } catch {
    products = [];
  }

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-rose-600">
        Category: {id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")}
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="p-6 bg-white rounded shadow border border-gray-100">
              <div className="font-semibold text-lg">{product.name}</div>
              <div className="text-gray-500">{product.description}</div>
              {/* Add more product details here */}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}