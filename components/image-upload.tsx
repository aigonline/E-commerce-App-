'use client'

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxFiles?: number
}

export function ImageUpload({ value, onChange, maxFiles = 10 }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setLoading(true)
        setError(null)
        const newFiles = acceptedFiles.slice(0, maxFiles - value.length)
        
        const uploadPromises = newFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          
          const { error: uploadError, data } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)

          if (uploadError) {
            console.error('Upload error:', uploadError)
            throw new Error(uploadError.message)
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

          return publicUrl
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        onChange([...value, ...uploadedUrls])
      } catch (error) {
        console.error('Upload error:', error)
        setError(error instanceof Error ? error.message : 'Failed to upload image')
      } finally {
        setLoading(false)
      }
    },
    [value, onChange, maxFiles, supabase]
  )


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: maxFiles - value.length,
    disabled: loading || value.length >= maxFiles
  })

  const removeImage = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((url, index) => (
          <div key={url} className="relative aspect-square">
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="rounded-lg object-cover"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute -right-2 -top-2"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {value.length < maxFiles && (
          <div
            {...getRootProps()}
            className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400"
          >
            <input {...getInputProps()} />
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                <span>Drag & drop or click to upload</span>
                <span className="mt-1 text-xs">
                  {maxFiles - value.length} images remaining
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}