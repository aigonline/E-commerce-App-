"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  Package, 
  DollarSign, 
  Heart, 
  MessageSquare, 
  Settings, 
  Check, 
  Trash2,
  Filter,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "bid" | "sale" | "shipping" | "watchlist" | "message" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "bid",
    title: "New bid on your item",
    message: "Someone placed a $125 bid on 'Vintage Camera Lens'",
    timestamp: "2 minutes ago",
    read: false,
    actionUrl: "/products/1",
    priority: "high"
  },
  {
    id: "2",
    type: "sale",
    title: "Item sold!",
    message: "Your 'iPhone 13 Pro' has been sold for $799.99",
    timestamp: "1 hour ago",
    read: false,
    actionUrl: "/profile",
    priority: "high"
  },
  {
    id: "3",
    type: "shipping",
    title: "Package shipped",
    message: "Your order #12345 has been shipped and is on its way",
    timestamp: "3 hours ago",
    read: true,
    actionUrl: "/orders/12345",
    priority: "medium"
  },
  {
    id: "4",
    type: "watchlist",
    title: "Price drop alert",
    message: "Sony Headphones in your watchlist dropped to $199 (was $249)",
    timestamp: "1 day ago",
    read: false,
    actionUrl: "/products/3",
    priority: "medium"
  },
  {
    id: "5",
    type: "message",
    title: "New message",
    message: "You have a message from buyer about 'MacBook Pro'",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/messages",
    priority: "low"
  },
  {
    id: "6",
    type: "system",
    title: "Account security",
    message: "New login detected from Chrome on Windows",
    timestamp: "3 days ago",
    read: true,
    priority: "medium"
  }
]

const notificationIcons = {
  bid: DollarSign,
  sale: Package,
  shipping: Package,
  watchlist: Heart,
  message: MessageSquare,
  system: Settings
}

const notificationColors = {
  bid: "text-green-600 bg-green-50",
  sale: "text-blue-600 bg-blue-50",
  shipping: "text-purple-600 bg-purple-50",
  watchlist: "text-rose-600 bg-rose-50",
  message: "text-yellow-600 bg-yellow-50",
  system: "text-gray-600 bg-gray-50"
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedTab, setSelectedTab] = useState("all")
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bidAlerts: true,
    priceDrops: true,
    orderUpdates: true,
    messages: true
  })

  const markAsRead = (id: string) => {
    setNotifications(notifs => 
      notifs.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifs => 
      notifs.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifs => notifs.filter(notif => notif.id !== id))
  }

  const filteredNotifications = selectedTab === "all" 
    ? notifications 
    : notifications.filter(notif => notif.type === selectedTab)

  const unreadCount = notifications.filter(notif => !notif.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">
            Stay updated with your latest activities
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-rose-500">{unreadCount} unread</Badge>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="bid">Bids</TabsTrigger>
          <TabsTrigger value="sale">Sales</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bell className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500 text-center">
                  {selectedTab === "all" 
                    ? "You're all caught up! No new notifications."
                    : `No ${selectedTab} notifications found.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type]
              const colorClass = notificationColors[notification.type]
              
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-gray-50",
                    !notification.read && "bg-blue-50/50 border-blue-200"
                  )}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-2 rounded-full", colorClass)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={cn(
                                "font-medium text-gray-900",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              {notification.priority === "high" && (
                                <Badge variant="destructive" className="text-xs">
                                  High
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notification.timestamp}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={notification.actionUrl}>View</a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Delivery Methods</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Email Notifications</label>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(s => ({ ...s, emailNotifications: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Push Notifications</label>
                  <p className="text-xs text-gray-500">Receive push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(s => ({ ...s, pushNotifications: checked }))
                  }
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Types</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Bid Alerts</label>
                  <p className="text-xs text-gray-500">When someone bids on your items</p>
                </div>
                <Switch
                  checked={settings.bidAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(s => ({ ...s, bidAlerts: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Price Drops</label>
                  <p className="text-xs text-gray-500">Watchlist items on sale</p>
                </div>
                <Switch
                  checked={settings.priceDrops}
                  onCheckedChange={(checked) => 
                    setSettings(s => ({ ...s, priceDrops: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Order Updates</label>
                  <p className="text-xs text-gray-500">Shipping and delivery updates</p>
                </div>
                <Switch
                  checked={settings.orderUpdates}
                  onCheckedChange={(checked) => 
                    setSettings(s => ({ ...s, orderUpdates: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Messages</label>
                  <p className="text-xs text-gray-500">New messages from buyers/sellers</p>
                </div>
                <Switch
                  checked={settings.messages}
                  onCheckedChange={(checked) => 
                    setSettings(s => ({ ...s, messages: checked }))
                  }
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-3">
            <Button variant="outline">Reset to Default</Button>
            <Button className="bg-rose-600 hover:bg-rose-700">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
