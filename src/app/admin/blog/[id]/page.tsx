"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
  authorId: string;
}

export default function EditArticuloPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        const data = await res.json();
        setPost(data);
      } catch {
        console.error("Error loading blog post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Cargando articulo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Articulo no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Editar Articulo</h1>
      <BlogEditor mode="edit" initialData={post} />
    </div>
  );
}
