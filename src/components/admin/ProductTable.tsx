"use client";

import Link from "next/link";
import { useState } from "react";

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

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 8;

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const pageProducts = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-dark/5 text-left">
              <th className="px-6 py-4 font-medium text-text-secondary">Imagen</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Nombre</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Tipo</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Categoria</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Precio</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Estado</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-dark/5">
            {pageProducts.map((product) => (
              <tr key={product.id} className="hover:bg-primary-dark/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                    </svg>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-text-primary">{product.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.type === "DIGITAL"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {product.type === "DIGITAL" ? "Digital" : "Fisico"}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{product.category}</td>
                <td className="px-6 py-4 text-text-primary font-medium">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.isActive
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {product.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-error hover:text-error/80 text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-primary-dark/5">
          <p className="text-sm text-text-muted">
            Mostrando {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, products.length)} de{" "}
            {products.length} productos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg bg-background text-text-secondary hover:bg-primary-dark/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-background text-text-secondary hover:bg-primary-dark/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
