"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  type: "DIGITAL" | "PHYSICAL";
  category: string;
  stock: number | null;
  isActive: boolean;
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      console.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Estas seguro de desactivar este producto?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
    } catch {
      console.error("Error deleting product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-primary">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Nuevo Producto
        </Link>
      </div>

      {loading ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Cargando productos...</p>
        </div>
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
    </div>
  );
}
