import AnimatedSection from "@/components/animations/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";

const articles = [
  {
    slug: "como-manejar-la-ansiedad",
    title: "Como manejar la ansiedad en el dia a dia",
    excerpt:
      "Descubre tecnicas practicas para gestionar la ansiedad y recuperar el control de tu bienestar emocional en situaciones cotidianas.",
    date: "15 Feb 2026",
    author: "Dra. Maria Rodriguez",
    coverColor: "bg-primary",
  },
  {
    slug: "beneficios-terapia-pareja",
    title: "Beneficios de la terapia de pareja",
    excerpt:
      "La terapia de pareja no es solo para crisis. Descubre como puede fortalecer tu relacion y mejorar la comunicacion con tu pareja.",
    date: "8 Feb 2026",
    author: "Dr. Carlos Mendez",
    coverColor: "bg-accent",
  },
  {
    slug: "mindfulness-para-principiantes",
    title: "Mindfulness para principiantes: guia practica",
    excerpt:
      "El mindfulness es una herramienta poderosa para reducir el estres. Aprende los fundamentos con esta guia paso a paso.",
    date: "1 Feb 2026",
    author: "Dra. Laura Jimenez",
    coverColor: "bg-primary-dark",
  },
  {
    slug: "autoestima-saludable",
    title: "Construye una autoestima saludable",
    excerpt:
      "La autoestima influye en todos los aspectos de tu vida. Conoce estrategias efectivas para cultivar una imagen positiva de ti mismo.",
    date: "25 Ene 2026",
    author: "Dra. Maria Rodriguez",
    coverColor: "bg-secondary",
  },
  {
    slug: "estres-laboral",
    title: "Manejo del estres laboral",
    excerpt:
      "El estres en el trabajo puede afectar tu salud fisica y mental. Aprende a identificar las senales y a implementar cambios efectivos.",
    date: "18 Ene 2026",
    author: "Dr. Carlos Mendez",
    coverColor: "bg-primary",
  },
  {
    slug: "comunicacion-asertiva",
    title: "Comunicacion asertiva en tus relaciones",
    excerpt:
      "Aprender a comunicarte de forma asertiva puede transformar tus relaciones personales y profesionales. Descubre como lograrlo.",
    date: "10 Ene 2026",
    author: "Dra. Laura Jimenez",
    coverColor: "bg-accent",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-20 px-6">
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl text-text-primary">
            Blog y Recursos
          </h1>
          <p className="text-text-secondary mt-4 text-lg">
            Articulos y consejos para tu bienestar emocional
          </p>
        </AnimatedSection>
      </section>

      {/* Article Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <BlogCard key={article.slug} {...article} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
