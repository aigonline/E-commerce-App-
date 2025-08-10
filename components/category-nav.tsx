import Link from "next/link"
import { Camera, Cpu, Gift, Home, Music, ShoppingBag, Shirt, Book, Activity } from "lucide-react"
import { getCategories } from "@/app/actions/categories"

const iconMap = {
  laptop: Cpu,
  shirt: Shirt,
  home: Home,
  star: Gift,
  activity: Activity,
  book: Book,
  music: Music,
  camera: Camera,
}

export async function CategoryNav() {
  const categories = await getCategories()
  
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap] || ShoppingBag
        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex flex-col items-center justify-center rounded-lg border bg-white p-3 sm:p-4 text-center transition-colors hover:border-rose-200 hover:bg-rose-50"
          >
            <div className="mb-2 rounded-full bg-gray-100 p-2">
              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium line-clamp-1">{category.name}</span>
            <span className="text-xs text-gray-500">{category.product_count || 0} items</span>
          </Link>
        )
      })}
    </div>
  )
}
