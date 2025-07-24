"use server";
import { createClient } from "@/app/lib/supabase/client";

export async function removeFromWatchlist(productId: string) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", session.user.id)
    .eq("product_id", productId);
  if (error) throw error;
  return true;
}
