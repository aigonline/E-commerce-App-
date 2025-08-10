"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function ProductPagination({ currentPage, totalPages, totalItems }: ProductPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/products?${params.toString()}`)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis and last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(-1) // -1 represents ellipsis
        }
        pages.push(totalPages)
      }
      
      // Add first page and ellipsis if needed
      if (startPage > 1) {
        if (startPage > 2) {
          pages.unshift(-1) // -1 represents ellipsis
        }
        pages.unshift(1)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="text-sm text-gray-500">
        Showing {((currentPage - 1) * 24) + 1}-{Math.min(currentPage * 24, totalItems)} of {totalItems} products
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              )
            }
            
            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={`min-w-[40px] ${
                  page === currentPage 
                    ? "bg-rose-600 hover:bg-rose-700" 
                    : ""
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            )
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
