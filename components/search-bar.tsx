"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")

  // Initialize search query from URL params
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setQuery(q)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new URL search params
    const params = new URLSearchParams(searchParams)
    
    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }
    
    // Reset to first page when searching
    params.delete("page")
    
    // Navigate to products page with search query
    router.push(`/products?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery("")
    const params = new URLSearchParams(searchParams)
    params.delete("q")
    params.delete("page")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-3xl">
      <Input
        type="search"
        placeholder="Search for products, brands, or categories..."
        className="rounded-r-none pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
      <Button type="submit" className="rounded-l-none bg-rose-600 hover:bg-rose-700">
        <Search className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
