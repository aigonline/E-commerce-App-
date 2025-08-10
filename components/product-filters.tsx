"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedFormat, setSelectedFormat] = useState("all")

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const conditions = searchParams.getAll("condition")
    const format = searchParams.get("format") || "all"
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")

    if (category) {
      setSelectedCategories([category])
    }
    
    if (conditions.length > 0) {
      setSelectedConditions(conditions)
    }
    
    setSelectedFormat(format)
    
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 1000
      ])
    }
  }, [searchParams])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked 
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(c => c !== categoryId)
    
    setSelectedCategories(newCategories)
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked
      ? [...selectedConditions, condition]
      : selectedConditions.filter(c => c !== condition)
    
    setSelectedConditions(newConditions)
  }

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format)
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    // Clear existing filter params
    params.delete("category")
    params.delete("condition")
    params.delete("format")
    params.delete("min_price")
    params.delete("max_price")
    params.delete("page")

    // Add category filters
    selectedCategories.forEach(category => {
      params.set("category", category)
    })

    // Add condition filters
    selectedConditions.forEach(condition => {
      params.append("condition", condition)
    })

    // Add format filter
    if (selectedFormat !== "all") {
      params.set("format", selectedFormat)
    }

    // Add price range
    if (priceRange[0] > 0) {
      params.set("min_price", priceRange[0].toString())
    }
    if (priceRange[1] < 1000) {
      params.set("max_price", priceRange[1].toString())
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedCategories([])
    setSelectedConditions([])
    setSelectedFormat("all")
    
    const params = new URLSearchParams(searchParams)
    params.delete("category")
    params.delete("condition")
    params.delete("format")
    params.delete("min_price")
    params.delete("max_price")
    params.delete("page")

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["category", "price", "condition", "buying-format"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="electronics" 
                  checked={selectedCategories.includes("electronics")}
                  onCheckedChange={(checked) => handleCategoryChange("electronics", checked as boolean)}
                />
                <Label htmlFor="electronics">Electronics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fashion" 
                  checked={selectedCategories.includes("fashion")}
                  onCheckedChange={(checked) => handleCategoryChange("fashion", checked as boolean)}
                />
                <Label htmlFor="fashion">Fashion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="home-garden" 
                  checked={selectedCategories.includes("home-garden")}
                  onCheckedChange={(checked) => handleCategoryChange("home-garden", checked as boolean)}
                />
                <Label htmlFor="home-garden">Home & Garden</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collectibles" 
                  checked={selectedCategories.includes("collectibles")}
                  onCheckedChange={(checked) => handleCategoryChange("collectibles", checked as boolean)}
                />
                <Label htmlFor="collectibles">Collectibles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sports" 
                  checked={selectedCategories.includes("sports")}
                  onCheckedChange={(checked) => handleCategoryChange("sports", checked as boolean)}
                />
                <Label htmlFor="sports">Sports</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider 
                defaultValue={[0, 1000]} 
                max={1000} 
                step={10} 
                value={priceRange} 
                onValueChange={setPriceRange} 
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-1 text-sm">$</span>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                  />
                </div>
                <span className="text-sm">to</span>
                <div className="flex items-center">
                  <span className="mr-1 text-sm">$</span>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 1000])}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="condition">
          <AccordionTrigger>Item Condition</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="new" 
                  checked={selectedConditions.includes("New")}
                  onCheckedChange={(checked) => handleConditionChange("New", checked as boolean)}
                />
                <Label htmlFor="new">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="used-excellent" 
                  checked={selectedConditions.includes("Used - Excellent")}
                  onCheckedChange={(checked) => handleConditionChange("Used - Excellent", checked as boolean)}
                />
                <Label htmlFor="used-excellent">Used - Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="used-good" 
                  checked={selectedConditions.includes("Used - Good")}
                  onCheckedChange={(checked) => handleConditionChange("Used - Good", checked as boolean)}
                />
                <Label htmlFor="used-good">Used - Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="used-fair" 
                  checked={selectedConditions.includes("Used - Fair")}
                  onCheckedChange={(checked) => handleConditionChange("Used - Fair", checked as boolean)}
                />
                <Label htmlFor="used-fair">Used - Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="for-parts" 
                  checked={selectedConditions.includes("For parts or not working")}
                  onCheckedChange={(checked) => handleConditionChange("For parts or not working", checked as boolean)}
                />
                <Label htmlFor="for-parts">For parts or not working</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="buying-format">
          <AccordionTrigger>Buying Format</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={selectedFormat} onValueChange={handleFormatChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Listings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auction" id="auction" />
                <Label htmlFor="auction">Auction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy_now" id="buy-now" />
                <Label htmlFor="buy-now">Buy It Now</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1 bg-rose-600 hover:bg-rose-700">
          Apply Filters
        </Button>
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          className="px-4"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
