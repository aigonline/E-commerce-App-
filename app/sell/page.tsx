import { requireUser } from "@/lib/auth"
import { ProductForm } from "@/components/product-form"

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic'

export default async function SellPage() {
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Authentication Error</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Supabase environment variables are not configured. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  await requireUser()
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">List an Item for Sale</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Create your listing and start selling to thousands of buyers on BidBay
          </p>
        </div>
        <ProductForm />
      </div>
    </div>
  )
}