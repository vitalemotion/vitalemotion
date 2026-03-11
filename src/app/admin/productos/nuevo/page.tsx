import ProductForm from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Nuevo Producto</h1>
      <ProductForm mode="create" />
    </div>
  );
}
