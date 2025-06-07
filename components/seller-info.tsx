import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Shield } from "lucide-react"

interface SellerInfoProps {
  seller: {
    username: string
    full_name: string
    avatar_url: string
    rating: number
    total_ratings: number
    created_at: string
  }
}

export function SellerInfo({ seller }: SellerInfoProps) {
  const memberSince = new Date(seller.created_at).getFullYear()
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar_url} alt={seller.username} />
            <AvatarFallback>{seller.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{seller.username}</CardTitle>
            <CardDescription>Member since {memberSince}</CardDescription>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(seller.rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-gray-200 text-gray-200"
                    }`} 
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">({seller.total_ratings})</span>
              </div>
              {seller.rating > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {(seller.rating * 20).toFixed(1)}% Positive
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rest of the component remains the same */}
      </CardContent>
    </Card>
  )
}