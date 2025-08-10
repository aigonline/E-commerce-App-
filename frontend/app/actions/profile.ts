import { apiFetch } from "@/app/lib/api";

export async function getProfileStats(token?: string) {
  try {
    return await apiFetch("/users/profile/stats", token ? { authToken: token } : undefined);
  } catch (error) {
    return {
      username: "User",
      full_name: "User",
      member_since: "-",
      feedback_score: "100% Positive",
      rating: 5,
      feedback_count: 0,
      items_sold: 0,
      active_listings: 0,
      avatar_url: "",
    };
  }
}