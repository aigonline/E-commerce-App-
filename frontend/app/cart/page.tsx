
"use client";
import React, { useState, useEffect } from "react";
import { getProductsByIds } from "../actions/cart";

type CartItem = {
  id: string;
  quantity: number;
};

type Product = {
  id: string;
  title: string;
  current_price: number;
  images?: { url: string }[];
};

function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartData = getCartFromStorage();
    setCart(cartData);
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProductsByIds(cart.map((item) => item.id)).then((prods) => {
      setProducts(prods);
      setLoading(false);
    });
  }, [cart]);

  const handleQuantityChange = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
      setCartToStorage(updated);
      return updated;
    });
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      setCartToStorage(updated);
      return updated;
    });
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return product ? sum + product.current_price * item.quantity : sum;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : cart.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => {
            const product = getProduct(item.id);
            if (!product) return null;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow"
              >
                <div className="flex items-center gap-4">
                  {product.images?.[0]?.url && (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-gray-500">${product.current_price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => handleQuantityChange(item.id, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    className="ml-4 text-red-500 hover:underline"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center mt-8 border-t pt-4">
            <div className="text-lg font-semibold">Total:</div>
            <div className="text-xl font-bold">${total.toFixed(2)}</div>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold mt-4 hover:bg-blue-700 transition"
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;