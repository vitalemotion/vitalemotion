import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";

const products = [
  {
    title: "El Arte de la Calma",
    price: "$45.000",
    tag: "Libro",
  },
  {
    title: "Guia de Mindfulness",
    price: "$25.000",
    tag: "Digital",
  },
  {
    title: "Diario de Emociones",
    price: "$35.000",
    tag: "Libro",
  },
  {
    title: "Taller de Autoestima (Video)",
    price: "$60.000",
    tag: "Digital",
  },
];

function BookIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
      <path d="M8 7h8" />
      <path d="M8 11h5" />
    </svg>
  );
}

export default function FeaturedProducts() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-accent mb-3">
            NUESTRA TIENDA
          </p>
          <h2 className="font-serif text-4xl text-text-primary">
            Recursos para tu crecimiento
          </h2>
        </AnimatedSection>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <AnimatedSection
              key={product.title}
              animation="fade-up"
              delay={index * 0.15}
            >
              <div className="bg-surface rounded-2xl overflow-hidden shadow-lg shadow-black/5">
                {/* Image placeholder */}
                <div className="bg-secondary h-64 flex items-center justify-center">
                  <BookIcon />
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-xs uppercase text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {product.tag}
                  </span>
                  <h3 className="font-serif text-lg mt-3 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-primary-dark font-bold text-xl mb-3">
                    {product.price}
                  </p>
                  <Link
                    href="/tienda"
                    className="text-primary hover:text-primary-dark transition-colors duration-200 text-sm font-medium"
                  >
                    Ver detalle &rarr;
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* View all link */}
        <AnimatedSection animation="fade-up" delay={0.6} className="text-center mt-12">
          <Link
            href="/tienda"
            className="inline-block text-primary hover:text-primary-dark transition-colors duration-200 font-medium text-lg underline underline-offset-4 decoration-primary/30 hover:decoration-primary-dark/50"
          >
            Ver toda la tienda &rarr;
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
