import { UserWatchlist } from "@/components/user-watchlist"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WatchlistPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">My Watchlist</h1>
      </div>
      
      <UserWatchlist />
    </div>
  )
}
