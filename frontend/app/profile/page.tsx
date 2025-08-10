"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserListings } from "@/components/user-listings";
import { UserBids } from "@/components/user-bids";
import { UserWatchlist } from "@/components/user-watchlist";
import { Bell, Edit, Settings, Star } from "lucide-react";
import { getProfileStats } from "@/app/actions/profile";
import Link from "next/link";

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfileStats(token || undefined);
      setProfile(data);
    }
    fetchProfile();
  }, [token]);

  if (!profile) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} alt={profile.full_name || "User"} />
                    <AvatarFallback>{profile.username?.slice(0,2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{profile.full_name || profile.username || "User"}</CardTitle>
                    <CardDescription>Member since {profile.member_since || "-"}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1">
                {[...Array(profile.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1 text-sm text-gray-500">({profile.feedback_count || 0})</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/profile/settings">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </Link>
                <Link href="/notifications">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Seller Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Feedback Score:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {profile.feedback_score || "100% Positive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Items Sold:</span>
                <span>{profile.items_sold ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Listings:</span>
                <span>{profile.active_listings ?? "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs defaultValue="listings">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="bids">My Bids</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            </TabsList>
            <TabsContent value="listings" className="mt-6">
              <UserListings />
            </TabsContent>
            <TabsContent value="bids" className="mt-6">
              <UserBids />
            </TabsContent>
            <TabsContent value="watchlist" className="mt-6">
              <UserWatchlist />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}