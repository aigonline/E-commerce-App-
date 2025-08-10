import { apiFetch } from "@/app/lib/api";

export async function register(email: string, password: string, username: string, fullName: string) {
  return apiFetch<{ message: string }>("/users/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username, fullName }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: any }>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getProfile(token: string) {
  return apiFetch("/users/profile", { authToken: token });
}