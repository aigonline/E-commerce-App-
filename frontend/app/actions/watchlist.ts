import { apiFetch } from "../lib/api";

// app/actions/watchlist.ts
export async function getWatchlist(token: string) {
  return apiFetch('/watchlist', { authToken: token });
}

export async function addToWatchlist(productId: string, token: string) {
  return apiFetch('/watchlist/add', {
    method: 'POST',
    body: JSON.stringify({ product: productId }),
    authToken: token
  });
}

export async function removeFromWatchlist(productId: string, token: string) {
  return apiFetch('/watchlist/remove', {
    method: 'POST',
    body: JSON.stringify({ product: productId }),
    authToken: token
  });
}
export async function getUserWatchlist() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { notAuthenticated: true };
    }
    return await apiFetch('/watchlist', { authToken: token });
  } catch (error) {
    console.error("Error in getUserWatchlist:", error);
    return { error: String(error) };
  }
}

export async function getProfileStats() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { 
        username: "Guest", 
        member_since: new Date().toISOString().split('T')[0],
        feedback_score: 0,
        rating: 0,
        feedback_count: 0,
        items_sold: 0,
        active_listings: 0
      };
    }
    
    return await apiFetch('/users/profile/stats', { authToken: token });
  } catch (error) {
    console.error("Error in getProfileStats:", error);
    return { 
      username: "User",
      error: String(error) 
    };
  }
}

export async function updateProfile(profileData: Record<string, any>) {
  const token = localStorage.getItem('token');
  if (!token) {
    return { notAuthenticated: true };
  }
  
  return await apiFetch('/users/profile', { 
    method: 'PUT',
    body: JSON.stringify(profileData),
    authToken: token 
  });
}