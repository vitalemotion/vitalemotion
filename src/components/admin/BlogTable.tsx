"use client";

import Link from "next/link";
import { useState } from "react";

type BlogPostStatus = "DRAFT" | "PUBLISHED";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: BlogPostStatus;
  authorName: string;
  createdAt: string;
}

interface BlogTableProps {
  posts: BlogPost[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: BlogPostStatus) => void;
}

const PAGE_SIZE = 8;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BlogTable({ posts, onDelete, onToggleStatus }: BlogTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pagePosts = posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-dark/5 text-left">
              <th className="px-6 py-4 font-medium text-text-secondary">Titulo</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Estado</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Autor</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Fecha</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-dark/5">
            {pagePosts.map((post) => (
              <tr key={post.id} className="hover:bg-primary-dark/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-text-primary">{post.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">/{post.slug}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      post.status === "PUBLISHED"
                        ? "bg-success/10 text-success"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {post.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{post.authorName}</td>
                <td className="px-6 py-4 text-text-secondary">{formatDate(post.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() =>
                        onToggleStatus(
                          post.id,
                          post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
                        )
                      }
                      className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                    >
                      {post.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="text-error hover:text-error/80 text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pagePosts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  No hay articulos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-primary-dark/5">
          <p className="text-sm text-text-muted">
            Mostrando {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, posts.length)} de{" "}
            {posts.length} articulos
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
