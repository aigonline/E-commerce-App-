import { apiFetch } from "@/app/lib/api";

// Fetch product details for an array of product IDs
export async function getProductsByIds(ids: string[]) {
  try {
    const res = await apiFetch<{ products: any[] }>("/products/by-ids", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
    return Array.isArray(res.products) ? res.products : [];
  } catch (error) {
    return [];
  }
}