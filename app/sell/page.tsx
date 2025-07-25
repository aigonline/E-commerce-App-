import { requireUser } from "@/app/lib/auth"
import { ProductForm } from "@/components/product-form"

export default async function SellPage() {
  // Check if user is authenticated
  await requireUser()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">List an Item for Sale</h1>
      <ProductForm />
    </div>
  )
}