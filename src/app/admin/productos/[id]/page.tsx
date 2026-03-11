"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: "DIGITAL" | "PHYSICAL";
  category: string;
  tags: string[];
  stock: number | null;
  isActive: boolean;
}

export default function EditProductoPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch {
        console.error("Error loading product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Producto no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Editar Producto</h1>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
