"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogTable from "@/components/admin/BlogTable";

type BlogPostStatus = "DRAFT" | "PUBLISHED";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: BlogPostStatus;
  authorName: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data);
    } catch {
      console.error("Error loading blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Estas seguro de eliminar este articulo?")) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      console.error("Error deleting post");
    }
  };

  const handleToggleStatus = async (id: string, newStatus: BlogPostStatus) => {
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch {
      console.error("Error toggling status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-primary">Blog</h1>
        <Link
          href="/admin/blog/nuevo"
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Nuevo Articulo
        </Link>
      </div>

      {loading ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Cargando articulos...</p>
        </div>
      ) : (
        <BlogTable
          posts={posts}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}
