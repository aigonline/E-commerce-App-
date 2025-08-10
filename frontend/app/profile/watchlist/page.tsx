"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getWatchlist } from "@/app/actions/watchlist";
import { removeFromWatchlist } from "@/app/actions/watchlist";

type WatchlistItem = {
  id: string;
  product: {
    id: string;
    title: string;
    images?: { url: string }[];
    current_price: number;
  };
};

// Special type for the response from getUserWatchlist
type WatchlistResponse = WatchlistItem[] | { notAuthenticated: boolean };


export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    
    async function fetchWatchlist() {
      try {
        const data = await getWatchlist();
        
        // Check for the special "not authenticated" response
        if (data && 'notAuthenticated' in data) {
          console.log("User not authenticated, redirecting to login");
          router.push("/auth/login");
          return;
        }
        
        if (isMounted) {
          setWatchlist(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchWatchlist();
    return () => { isMounted = false; };
  }, [router]);


  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      const result = await removeFromWatchlist(productId);
      
      if ('error' in result) {
        if (result.error === "Not authenticated") {
          console.log("User not authenticated during remove, redirecting to login");
          router.push("/auth/login");
          return;
        }
        
        // Show error message
        alert(`Failed to remove item: ${result.error}`);
        return;
      }
      
      // If successful, remove the item from the local state
      setWatchlist((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (e) {
      console.error("Exception in handleRemove:", e);
      alert("Something went wrong. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading your watchlist...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <div className="text-gray-500">Your watchlist is empty.</div>
      ) : (
        <ul className="space-y-4">
          {watchlist.map((item) => (
            <li
              key={item.id}
              className="flex items-center bg-white rounded shadow p-4"
            >
              <img
                src={item.product.images?.[0]?.url || "/placeholder.jpg"}
                alt={item.product.title}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.product.title}</div>
                <div className="text-gray-600">${item.product.current_price.toFixed(2)}</div>
              </div>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={removing === item.product.id}
              >
                {removing === item.product.id ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}