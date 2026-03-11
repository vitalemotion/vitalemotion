import BlogEditor from "@/components/admin/BlogEditor";

export default function NuevoArticuloPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Nuevo Articulo</h1>
      <BlogEditor mode="create" />
    </div>
  );
}
