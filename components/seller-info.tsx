import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Shield } from "lucide-react"

export function SellerInfo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="Seller" />
            <AvatarFallback>VR</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">vintage_collector_92</CardTitle>
            <CardDescription>Member since 2019</CardDescription>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">(247)</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                99.2% Positive
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Items sold:</span>
            <span className="ml-2 font-medium">1,247</span>
          </div>
          <div>
            <span className="text-gray-500">Response time:</span>
            <span className="ml-2 font-medium">{"< 1 hour"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Shield className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
