import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/app/actions/products";

export default async function DealsPage() {
  let deals: any[] = [];
  
  try {
    // Fetch products sorted by price (ascending for better deals first)
    const result = await getProducts({ 
      sort: "price_asc", 
      page: 1,
      limit: 50 // Get more products to find deals
    });
    
    const products = Array.isArray(result.products) ? result.products : [];
    
    // Filter for products that are deals (current_price < start_price)
    // Also include auction items where current bid is below starting price
    deals = products.filter((product) => {
      const currentPrice = Number(product.current_price) || 0;
      const startPrice = Number(product.start_price) || 0;
      
      // Consider it a deal if:
      // 1. Current price is less than start price (discount)
      // 2. It's an auction with bids below starting price
      // 3. Or if it's a buy-now item with a good discount
      return currentPrice > 0 && startPrice > 0 && currentPrice < startPrice;
    });
    
    // Sort deals by discount percentage (highest discount first)
    deals.sort((a, b) => {
      const discountA = ((a.start_price - a.current_price) / a.start_price) * 100;
      const discountB = ((b.start_price - b.current_price) / b.start_price) * 100;
      return discountB - discountA;
    });
    
    // Limit to top 24 deals
    deals = deals.slice(0, 24);
    
  } catch (error) {
    console.error("Error fetching deals:", error);
    deals = [];
  }

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rose-600">🔥 Hot Deals</h1>
        <p className="text-gray-600">Limited time offers - grab them while they last!</p>
      </div>
      
      {deals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-600">No deals available right now</h2>
          <p className="text-gray-500">Check back soon for amazing offers!</p>
          <Link 
            href="/products" 
            className="inline-block mt-4 bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700 transition"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Found {deals.length} amazing deal{deals.length !== 1 ? 's' : ''}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((deal) => {
              const discountPercent = Math.round(
                ((deal.start_price - deal.current_price) / deal.start_price) * 100
              );
              const savings = deal.start_price - deal.current_price;
              
              return (
                <Card key={deal._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={deal.images?.[0]?.url || "/placeholder.jpg"}
                      alt={deal.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      variant="destructive" 
                      className="absolute top-2 right-2 font-bold"
                    >
                      -{discountPercent}%
                    </Badge>
                    {deal.is_auction && (
                      <Badge 
                        variant="outline" 
                        className="absolute top-2 left-2 bg-white"
                      >
                        Auction
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {deal.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {deal.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-rose-600">
                          ${deal.current_price.toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-gray-400">
                          ${deal.start_price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-green-600 font-medium">
                        You save ${savings.toFixed(2)}!
                      </div>
                      
                      {deal.condition && (
                        <div className="text-xs text-gray-500">
                          Condition: {deal.condition}
                        </div>
                      )}
                    </div>
                    
                    <Link
                      href={`/products/${deal._id}`}
                      className="block w-full text-center bg-rose-600 text-white py-2 rounded hover:bg-rose-700 transition font-medium"
                    >
                      {deal.is_auction ? 'Place Bid' : 'Buy Now'}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}