"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortDropdownProps {
  currentSort: string
}

export function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sort", value)
    params.delete("page") // Reset to first page when sorting changes
    router.push(`/products?${params.toString()}`)
  }

  const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "price_asc", label: "Price: Low to high" },
    { value: "price_desc", label: "Price: High to low" },
    { value: "ending", label: "Ending soon" },
    { value: "bids", label: "Most bids" },
  ]

  const currentLabel = sortOptions.find(option => option.value === currentSort)?.label || "Newest first"

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={currentLabel} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
