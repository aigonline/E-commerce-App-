'use client'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createProduct } from "@/app/actions/products"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./image-upload"

const CONDITIONS = [
    { label: "New", value: "new" },
    { label: "Like New", value: "like_new" },
    { label: "Used - Excellent", value: "used_excellent" },
    { label: "Used - Good", value: "used_good" },
    { label: "Used - Fair", value: "used_fair" },
]
const CATEGORIES = [
    { label: "Electronics", value: "c47b4ecc-1234-4b4c-9aaa-dc98e8a1a3d1" },
    { label: "Fashion", value: "d5e6f788-5678-4321-bbbb-abc123def456" },
    { label: "Home & Garden", value: "a1b2c3d4-9012-4567-cccc-456789abcdef" },
    { label: "Sports", value: "e5f6a7b8-3456-7890-dddd-789012345678" },
    { label: "Toys & Hobbies", value: "19a0b1c2-6789-0123-eeee-abcdef123456" },
    { label: "Collectibles", value: "f3e4d5c6-4567-8901-ffff-fedcba987654" }
]
const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category_id: z.string({ required_error: "Please select a category" })
        .uuid("Invalid category selected"),
    condition: z.string({ required_error: "Please select a condition" }),
    starting_price: z.number({
        required_error: "Starting price is required",
        invalid_type_error: "Starting price must be a number"
    }).min(0.01, "Price must be greater than 0"),
    buy_now_price: z.number().nullable().optional()
        .refine(val => val === null || val === undefined || val > 0, "Buy now price must be greater than 0"),
    end_date: z.date({ required_error: "End date is required" })
        .min(new Date(), "End date must be in the future"),
    images: z.array(z.string())
        .min(1, "At least one image is required")
        .max(10, "Maximum 10 images allowed")
})

export function ProductForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            category_id: "",
            condition: "",
            starting_price: 0,
            buy_now_price: null,
            end_date: undefined,
            images: []
        }
    })

    async function onSubmit(values: z.infer<typeof productSchema>) {
        try {
            setLoading(true)
            const product = await createProduct(values)

            if (!product) {
                throw new Error('Failed to create product')
            }

            toast({
                title: "Success",
                description: "Product created successfully",
            })

            router.refresh()
            router.push(`/products/${product.id}`)
        } catch (error) {
            console.error('Failed to create product:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create product",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter product title" />
                            </FormControl>
                            <FormDescription>
                                A clear, descriptive title for your product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Describe your product in detail"
                                    className="min-h-[120px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CONDITIONS.map((condition) => (
                                        <SelectItem key={condition.value} value={condition.value}>
                                            {condition.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="starting_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Starting Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={field.value || ''}
                                    onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="buy_now_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Buy Now Price (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={field.value ?? ''}
                                    onChange={e => {
                                        const value = e.target.valueAsNumber
                                        field.onChange(isNaN(value) ? null : value)
                                    }}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                                    onChange={e => field.onChange(new Date(e.target.value))}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    maxFiles={10}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload up to 10 images of your product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Listing'}
                </Button>
            </form>
        </Form>
    )
}