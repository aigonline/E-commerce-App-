"use client";
import React, { useEffect, useState } from "react";
import { getUserWatchlist } from "@/app/actions/profile";
import { removeFromWatchlist } from "../../actions/watchlist-actions";

type WatchlistItem = {
  id: string;
  product: {
    id: string;
    title: string;
    images?: { url: string }[];
    current_price: number;
  };
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    getUserWatchlist().then((data) => {
      setWatchlist(data || []);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await removeFromWatchlist(productId);
      setWatchlist((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (e) {
      alert("Failed to remove from watchlist.");
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