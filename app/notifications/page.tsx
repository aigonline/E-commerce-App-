import { NotificationsPage } from "@/components/notifications-page"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Notifications() {
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <Badge variant="secondary">3 New</Badge>
        </div>
      </div>
      
      <NotificationsPage />
    </div>
  )
}
