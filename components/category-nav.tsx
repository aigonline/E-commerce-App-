import Link from "next/link"
import { Camera, Cpu, Gift, Home, Music, ShoppingBag, Shirt, Ticket, Watch } from "lucide-react"

export function CategoryNav() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-center transition-colors hover:border-rose-200 hover:bg-rose-50"
        >
          <div className="mb-2 rounded-full bg-gray-100 p-2">
            <category.icon className="h-6 w-6 text-gray-600" />
          </div>
          <span className="text-sm font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}

const categories = [
  {
    name: "Electronics",
    href: "/category/electronics",
    icon: Cpu,
  },
  {
    name: "Fashion",
    href: "/category/fashion",
    icon: Shirt,
  },
  {
    name: "Home",
    href: "/category/home",
    icon: Home,
  },
  {
    name: "Collectibles",
    href: "/category/collectibles",
    icon: Gift,
  },
  {
    name: "Jewelry",
    href: "/category/jewelry",
    icon: Watch,
  },
  {
    name: "Cameras",
    href: "/category/cameras",
    icon: Camera,
  },
  {
    name: "Music",
    href: "/category/music",
    icon: Music,
  },
  {
    name: "Tickets",
    href: "/category/tickets",
    icon: Ticket,
  },
  {
    name: "Other",
    href: "/category/other",
    icon: ShoppingBag,
  },
]
