// app/actions/products.ts (already exists)
import { apiFetch } from "@/app/lib/api";

export async function getProducts(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/products?${query}`);
}

export async function getProductById(id: string) {
  return apiFetch(`/products/${id}`);
}

// app/actions/categories.ts
export async function getCategories() {
  return apiFetch('/categories');
}

// app/actions/cart.ts
export async function getCart(token: string) {
  return apiFetch('/cart', { authToken: token });
}

export async function addToCart(productId: string, quantity: number, token: string) {
  return apiFetch('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
    authToken: token
  });
}
export async function getProductsByIds(ids: string[]) {
  return apiFetch<any[]>('/products/by-ids', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function updateCartItem(productId: string, quantity: number, token: string) {
  return apiFetch('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
    authToken: token,
  });
}xport async function createProduct(productData: any) {
  try {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) throw new Error("Authentication required");

    // Map frontend data to backend format
    const backendData = {
      title: productData.title,
      description: productData.description,
      category: productData.category_id, // Your backend expects 'category'
      condition: productData.condition,
      start_price: productData.starting_price, // Your backend uses 'start_price'
      current_price: productData.starting_price, // Initialize current_price
      is_auction: true, // Default to auction
      is_buy_now: productData.buy_now_price ? true : false,
      buy_now_price: productData.buy_now_price,
      end_date: productData.end_date,
      images: productData.images.map((url: string, index: number) => ({
        url,
        position: index
      })),
      status: 'active'
    };

    const result = await apiFetch("/products", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    return result;
  } catch (error) {
    console.error("Create product error:", error);
    throw error;
  }
}

export async function removeCartItem(productId: string, token: string) {
  return apiFetch('/cart/remove', {
    method: 'DELETE',
    body: JSON.stringify({ productId }),
    authToken: token,
  });
}