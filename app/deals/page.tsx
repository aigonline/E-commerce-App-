
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/app/actions/products";

export default async function DealsPage() {
  // Fetch all products (or you can limit to a certain number)
  const { products } = await getProducts({ sort: "price_asc", limit: 24 });

  // Filter for products with a discount (current_price < starting_price)
  const deals = products.filter(
    (p) =>
      typeof p.starting_price === "number" &&
      typeof p.current_price === "number" &&
      p.current_price < p.starting_price
  );

  return (
    <main className="container py-8">
      <h1 className="text-3xl pl-3 md:pl-6 font-bold mb-6 text-rose-600">Hot Deals</h1>
      {deals.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No deals available right now. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="p-4 flex flex-col items-center">
              <img
                src={deal.images?.[0]?.url || "/placeholder.jpg"}
                alt={deal.title}
                className="w-32 h-32 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
              <p className="text-gray-500 mb-2 text-center">{deal.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-rose-600 text-lg font-bold">${deal.current_price.toFixed(2)}</span>
                <span className="line-through text-gray-400">${deal.starting_price.toFixed(2)}</span>
                <Badge variant="destructive">{Math.round(100 - (deal.current_price / deal.starting_price) * 100)}% OFF</Badge>
              </div>
              <Link
                href={`/products/${deal.id}`}
                className="mt-auto bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
              >
                View Deal
              </Link>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
