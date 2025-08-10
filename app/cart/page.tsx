import { ShoppingCart } from "@/components/shopping-cart"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
      </div>
      
      <ShoppingCart />
    </div>
  )
}
