"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Clock, Edit, Eye, Trash2, Plus, TrendingUp, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface UserListing {
  id: string
  title: string
  image: string
  price: number
  bids: number
  views: number
  timeLeft: string
  listedDate: string
  status: "active" | "ended" | "draft"
  isAuction: boolean
  endDate?: string
}

export function UserListings() {
  const [listings, setListings] = useState<UserListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading listings
    setTimeout(() => {
      setListings(mockListings)
      setLoading(false)
    }, 1000)

    // Set up real-time updates for auction timers
    const interval = setInterval(() => {
      setListings(prev => prev.map(listing => {
        if (listing.endDate && listing.isAuction) {
          const now = new Date()
          const end = new Date(listing.endDate)
          if (now >= end && listing.status !== "ended") {
            return { ...listing, status: "ended" as const, timeLeft: "Ended" }
          }
        }
        return listing
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeLeft = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return "Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleDeleteListing = async (listingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setListings(prev => prev.filter(listing => listing.id !== listingId))
      toast.success("Listing deleted successfully")
    } catch (error) {
      toast.error("Failed to delete listing")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <TrendingUp className="h-4 w-4" />
      case "ended":
        return <Clock className="h-4 w-4" />
      case "draft":
        return <Edit className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "ended":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex gap-4">
                <div className="h-20 w-20 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
        <p className="text-gray-500 mb-4">Start selling your items to earn money.</p>
        <Button asChild>
          <Link href="/sell">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Listings ({listings.length})</h3>
        <Button asChild>
          <Link href="/sell">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>
      
      {listings.map((listing) => (
        <Card key={listing.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image 
                    src={listing.image || "/placeholder.svg"} 
                    alt={listing.title} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform" 
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg hover:text-rose-600 transition-colors">
                    <Link href={`/products/${listing.id}`}>{listing.title}</Link>
                  </CardTitle>
                  <CardDescription>Listed {listing.listedDate}</CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge 
                      variant={getStatusColor(listing.status) as any}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(listing.status)}
                      {listing.status}
                    </Badge>
                    {listing.isAuction && listing.status === "active" && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {listing.endDate ? formatTimeLeft(listing.endDate) : listing.timeLeft}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${listing.price.toFixed(2)}</p>
                {listing.isAuction && (
                  <p className="text-sm text-gray-500">
                    {listing.bids} {listing.bids === 1 ? 'bid' : 'bids'}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {listing.views} {listing.views === 1 ? 'view' : 'views'}
                </p>
                {listing.status === "active" && listing.bids > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    Earning: ${(listing.price * 0.9).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${listing.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
              
              {listing.status !== "ended" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/sell/edit/${listing.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                      {listing.bids > 0 && " This listing has active bids."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteListing(listing.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {listing.status === "ended" && listing.bids > 0 && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Mark as Sold
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const mockListings: UserListing[] = [
  {
    id: "1",
    title: "Vintage Polaroid SX-70 Land Camera",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
    price: 120.5,
    bids: 23,
    views: 156,
    timeLeft: "2d 4h",
    listedDate: "3 days ago",
    status: "active",
    isAuction: true,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Antique Brass Compass",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    price: 75.0,
    bids: 8,
    views: 89,
    timeLeft: "1d 12h",
    listedDate: "1 week ago",
    status: "active",
    isAuction: true,
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Vintage Leather Journal",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
    price: 45.0,
    bids: 12,
    views: 67,
    timeLeft: "",
    listedDate: "2 weeks ago",
    status: "ended",
    isAuction: false,
  },
  {
    id: "4",
    title: "Retro Gaming Console Bundle",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    price: 0,
    bids: 0,
    views: 3,
    timeLeft: "",
    listedDate: "1 hour ago",
    status: "draft",
    isAuction: false,
  },
]
