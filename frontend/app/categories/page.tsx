import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    slug: "electronics",
    name: "Electronics",
    description: "Computers, phones, tablets, cameras, and more",
  },
  {
    slug: "fashion",
    name: "Fashion",
    description: "Clothing, shoes, accessories, and jewelry",
  },
  {
    slug: "home-garden",
    name: "Home & Garden",
    description: "Furniture, decor, appliances, and outdoor",
  },
  {
    slug: "collectibles",
    name: "Collectibles",
    description: "Rare items, antiques, coins, and memorabilia",
  },
  {
    slug: "sports",
    name: "Sports",
    description: "Equipment, apparel, memorabilia, and tickets",
  },
  {
    slug: "toys-hobbies",
    name: "Toys & Hobbies",
    description: "Games, puzzles, models, and crafts",
  },
];

export default function CategoriesPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-rose-600">Shop by Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="block p-6 bg-white rounded shadow hover:shadow-lg transition border border-gray-100 hover:border-rose-200"
          >
            <div className="text-xl font-semibold mb-2 text-rose-600">{cat.name}</div>
            <div className="text-gray-500 mb-2">{cat.description}</div>
            <div className="flex items-center gap-1 text-rose-500 font-medium">
              View products <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
