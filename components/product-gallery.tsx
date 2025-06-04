"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
        <Image
          src={images[selectedImage].src || "/placeholder.svg"}
          alt={images[selectedImage].alt}
          fill
          className="object-contain"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border bg-white",
              selectedImage === index && "ring-2 ring-rose-600",
            )}
            onClick={() => setSelectedImage(index)}
          >
            <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

const images = [
  {
    src: "/placeholder.svg?height=500&width=500",
    alt: "Product image 1",
  },
  {
    src: "/placeholder.svg?height=500&width=500",
    alt: "Product image 2",
  },
  {
    src: "/placeholder.svg?height=500&width=500",
    alt: "Product image 3",
  },
  {
    src: "/placeholder.svg?height=500&width=500",
    alt: "Product image 4",
  },
  {
    src: "/placeholder.svg?height=500&width=500",
    alt: "Product image 5",
  },
]
