import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">BidBay</h3>
            <p className="max-w-xs text-sm text-gray-500">
              Your trusted marketplace for unique finds and amazing deals. Join thousands of buyers and sellers on our
              platform.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-500 hover:text-gray-900">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-500 hover:text-gray-900">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-500 hover:text-gray-900">
                  Sell
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-500 hover:text-gray-900">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-500 hover:text-gray-900">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-500 hover:text-gray-900">
                  Buyer Protection
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-sm text-gray-500">Subscribe to get special offers, free giveaways, and deals.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500 md:text-left">
              © {new Date().getFullYear()} BidBay. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-gray-900">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-gray-900">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="hover:text-gray-900">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
