"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000])

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["category", "price", "condition", "buying-format"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="electronics" />
                <Label htmlFor="electronics">Electronics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fashion" />
                <Label htmlFor="fashion">Fashion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="home" />
                <Label htmlFor="home">Home & Garden</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="collectibles" />
                <Label htmlFor="collectibles">Collectibles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sports" />
                <Label htmlFor="sports">Sports</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 1000]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-1 text-sm">$</span>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                  />
                </div>
                <span className="text-sm">to</span>
                <div className="flex items-center">
                  <span className="mr-1 text-sm">$</span>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
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
                <Checkbox id="new" />
                <Label htmlFor="new">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="used-excellent" />
                <Label htmlFor="used-excellent">Used - Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="used-good" />
                <Label htmlFor="used-good">Used - Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="used-fair" />
                <Label htmlFor="used-fair">Used - Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="for-parts" />
                <Label htmlFor="for-parts">For parts or not working</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="buying-format">
          <AccordionTrigger>Buying Format</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Listings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auction" id="auction" />
                <Label htmlFor="auction">Auction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy-now" id="buy-now" />
                <Label htmlFor="buy-now">Buy It Now</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="w-full bg-rose-600 hover:bg-rose-700">Apply Filters</Button>
    </div>
  )
}
