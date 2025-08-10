const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { authToken?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  // Attach JWT if provided
  if (options?.authToken) {
    headers['Authorization'] = `Bearer ${options.authToken}`;
  }

  try {
    console.log(`Making request to: ${API_URL}${endpoint}`); // Debug log
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    
    // Handle network errors
    if (error instanceof TypeError && error.message === 'fetch failed') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    
    throw error;
  }
}