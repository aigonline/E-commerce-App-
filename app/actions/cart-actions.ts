import { createClient } from "@/app/lib/supabase/client";

export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, images:product_images(*)`)
    .in("id", ids);
  if (error) {
    console.error("Error fetching products by ids:", error);
    return [];
  }
  return data || [];
}
