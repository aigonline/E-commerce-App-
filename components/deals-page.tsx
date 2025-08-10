"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Timer, Flame, Star, TrendingUp, Clock, Users } from "lucide-react"

interface Deal {
  id: string
  title: string
  price: number
  originalPrice: number
  discountPercentage: number
  image: string
  category: string
  timeLeft: string
  dealType: "flash" | "daily" | "weekly" | "clearance"
  rating: number
  soldCount: number
  stockLeft?: number
}

const mockDeals: Deal[] = [
    {
        id: "1",
        title: "Nike Air Max 270 React",
        price: 89.99,
        originalPrice: 130.00,
        discountPercentage: 31,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
        category: "Footwear",
        timeLeft: "2h 15m",
        dealType: "flash",
        rating: 4.7,
        soldCount: 156,
        stockLeft: 3
    },
    {
        id: "2",
        title: "PlayStation 5 Console",
        price: 399.99,
        originalPrice: 499.99,
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop",
        category: "Gaming",
        timeLeft: "1d 4h",
        dealType: "daily",
        rating: 4.8,
        soldCount: 89,
        stockLeft: 10
    },
    {
        id: "3",
        title: "Sony WH-1000XM4 Headphones",
        price: 199.99,
        originalPrice: 349.99,
        discountPercentage: 43,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
        category: "Electronics",
        timeLeft: "3d 12h",
        dealType: "weekly",
        rating: 4.9,
        soldCount: 234
    },
    {
        id: "4",
        title: "Vintage Denim Jacket",
        price: 45.99,
        originalPrice: 89.99,
        discountPercentage: 49,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        category: "Fashion",
        timeLeft: "5d 8h",
        dealType: "clearance",
        rating: 4.3,
        soldCount: 67
    }
]

const dealTypeConfig = {
  flash: { icon: Flame, label: "Flash Deal", color: "bg-red-500" },
  daily: { icon: Timer, label: "Daily Deal", color: "bg-orange-500" },
  weekly: { icon: TrendingUp, label: "Weekly Deal", color: "bg-blue-500" },
  clearance: { icon: Star, label: "Clearance", color: "bg-purple-500" }
}

export function DealsPage() {
  const [selectedType, setSelectedType] = useState<string>("all")

  const filteredDeals = selectedType === "all" 
    ? mockDeals 
    : mockDeals.filter(deal => deal.dealType === selectedType)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">🔥 Hot Deals & Discounts</h1>
          <p className="text-rose-100 text-lg">
            Limited time offers with up to 70% off on selected items
          </p>
          <div className="flex items-center gap-2 mt-4 text-rose-100">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Deals refresh daily at midnight</span>
          </div>
        </div>
      </div>

      {/* Deal Type Filters */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          onClick={() => setSelectedType("all")}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4" />
          All Deals
        </Button>
        {Object.entries(dealTypeConfig).map(([type, config]) => {
          const Icon = config.icon
          return (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {config.label}
            </Button>
          )
        })}
      </div>

      {/* Deals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDeals.map((deal) => {
          const dealConfig = dealTypeConfig[deal.dealType]
          const Icon = dealConfig.icon
          
          return (
            <Card key={deal.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Deal Type Badge */}
                <Badge className={`absolute top-3 left-3 ${dealConfig.color} text-white border-0`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {dealConfig.label}
                </Badge>
                
                {/* Discount Badge */}
                <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                  -{deal.discountPercentage}%
                </Badge>
                
                {/* Time Left */}
                <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  <Timer className="h-3 w-3 inline mr-1" />
                  {deal.timeLeft}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {deal.category}
                    </Badge>
                    <Link 
                      href={`/products/${deal.id}`}
                      className="font-semibold text-gray-900 hover:text-rose-600 line-clamp-2 block"
                    >
                      {deal.title}
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{deal.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{deal.soldCount} sold</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${deal.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${deal.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-green-600 font-medium">
                      You save ${(deal.originalPrice - deal.price).toFixed(2)}
                    </div>
                    
                    {deal.stockLeft && deal.stockLeft <= 5 && (
                      <Badge variant="destructive" className="text-xs">
                        Only {deal.stockLeft} left!
                      </Badge>
                    )}
                  </div>
                  
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No Deals Message */}
      {filteredDeals.length === 0 && (
        <div className="text-center py-16">
          <Timer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No deals available
          </h3>
          <p className="text-gray-500">
            No deals found for the selected type. Check back later for new offers!
          </p>
        </div>
      )}

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Never Miss a Deal
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get notified when new deals drop and exclusive offers just for you
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <Button className="bg-rose-600 hover:bg-rose-700">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
