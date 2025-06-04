"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Searching for:", query)
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
      <Button type="submit" className="rounded-l-none bg-rose-600 hover:bg-rose-700">
        <Search className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
