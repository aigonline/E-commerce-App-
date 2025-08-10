import { DealsPage } from "@/components/deals-page"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingDown, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Deals() {
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <TrendingDown className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl md:text-3xl font-bold">Daily Deals</h1>
          <Badge className="bg-red-500 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Limited Time
          </Badge>
        </div>
      </div>
      
      <DealsPage />
    </div>
  )
}
