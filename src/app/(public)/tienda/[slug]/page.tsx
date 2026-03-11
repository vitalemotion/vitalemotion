import { prisma } from "@/lib/db";
import ProductDetail from "@/components/store/ProductDetail";
import { placeholderProducts } from "../page";
import type { Product } from "@/components/store/TiendaClient";

async function getProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0] || "#A8C5B8",
        type: p.type as "DIGITAL" | "PHYSICAL",
        category: p.category,
        tags: p.tags,
        description: p.description,
      }));
    }
    return placeholderProducts;
  } catch {
    return placeholderProducts;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const products = await getProducts();
  return <ProductDetail params={params} products={products} />;
}
