"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authProvider";
import { ProductForm } from "@/components/product-form";

export default function SellPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user || !token) {
      router.push("/auth/login");
    }
  }, [user, token, router]);

  // Show loading while checking auth
  if (!user || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">List an Item for Sale</h1>
      <ProductForm />
    </div>
  );
}