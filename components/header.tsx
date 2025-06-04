"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Bell, Heart, Menu, Search, ShoppingCart, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="text-xl font-bold text-rose-600">BidBay</span>
              </Link>
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <Link href="/products" className="text-lg font-medium">
                All Products
              </Link>
              <Link href="/categories" className="text-lg font-medium">
                Categories
              </Link>
              <Link href="/sell" className="text-lg font-medium">
                Sell
              </Link>
              <Link href="/help" className="text-lg font-medium">
                Help & Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center gap-2 font-semibold">
          <span className="hidden text-xl font-bold text-rose-600 md:inline-block">BidBay</span>
          <span className="text-xl font-bold text-rose-600 md:hidden">BB</span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categories.map((category) => (
                    <li key={category.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={category.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{category.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {category.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/products" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>All Products</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/deals" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Deals</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/sell" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sell</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className={cn("ml-auto flex items-center gap-4", isSearchOpen ? "hidden" : "flex")}>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <div className="hidden md:block md:w-80 lg:w-96">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-full bg-gray-100 pl-8 focus-visible:bg-background"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Watchlist</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </div>
        <div
          className={cn(
            "absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-background px-4 md:px-6",
            isSearchOpen ? "flex" : "hidden",
          )}
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for anything..."
              className="w-full rounded-full bg-gray-100 pl-8 focus-visible:bg-background"
              autoFocus
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </header>
  )
}

const categories = [
  {
    title: "Electronics",
    description: "Computers, phones, tablets, cameras, and more",
    href: "/category/electronics",
  },
  {
    title: "Fashion",
    description: "Clothing, shoes, accessories, and jewelry",
    href: "/category/fashion",
  },
  {
    title: "Home & Garden",
    description: "Furniture, decor, appliances, and outdoor",
    href: "/category/home-garden",
  },
  {
    title: "Collectibles",
    description: "Rare items, antiques, coins, and memorabilia",
    href: "/category/collectibles",
  },
  {
    title: "Sports",
    description: "Equipment, apparel, memorabilia, and tickets",
    href: "/category/sports",
  },
  {
    title: "Toys & Hobbies",
    description: "Games, puzzles, models, and crafts",
    href: "/category/toys-hobbies",
  },
]

function navigationMenuTriggerStyle() {
  return cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
  )
}
