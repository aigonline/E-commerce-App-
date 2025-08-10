"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: {
    url: string
    alt?: string
  }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Convert the images to the expected format
  const galleryImages = images.map((img, index) => ({
    src: img.url,
    alt: img.alt || `Product image ${index + 1}`
  }))

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
        {galleryImages[selectedImage] && (
          <Image
            src={galleryImages[selectedImage]?.src || "/placeholder.svg"}
            alt={galleryImages[selectedImage]?.alt ?? `Product image ${selectedImage + 1}`}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border bg-white",
              selectedImage === index && "ring-2 ring-rose-600",
            )}
            onClick={() => setSelectedImage(index)}
          >
            <Image 
              src={image.src || "/placeholder.svg"} 
              alt={image.alt} 
              fill 
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}


