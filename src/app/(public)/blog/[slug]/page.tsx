import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";
import { prisma } from "@/lib/db";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverColor: string;
  content: string[];
}

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    slug: "como-manejar-la-ansiedad",
    title: "Como manejar la ansiedad en el dia a dia",
    excerpt:
      "Descubre tecnicas practicas para gestionar la ansiedad y recuperar el control de tu bienestar emocional en situaciones cotidianas.",
    date: "15 Feb 2026",
    author: "Dra. Maria Rodriguez",
    coverColor: "bg-primary",
    content: [
      "La ansiedad es una respuesta natural del cuerpo ante situaciones de estres o peligro. Sin embargo, cuando se vuelve cronica, puede afectar significativamente nuestra calidad de vida. En este articulo, exploraremos tecnicas practicas y basadas en evidencia para manejar la ansiedad en tu dia a dia.",
      "Una de las tecnicas mas efectivas es la respiracion diafragmatica. Esta tecnica consiste en respirar profundamente, expandiendo el abdomen en lugar del pecho. Practica inhalar durante 4 segundos, sostener durante 4 segundos y exhalar durante 6 segundos. Repite este ciclo durante 5 minutos.",
      "El mindfulness o atencion plena es otra herramienta poderosa. Consiste en prestar atencion al momento presente sin juzgar. Puedes comenzar con ejercicios simples como observar tu respiracion durante unos minutos cada dia.",
      "La actividad fisica regular tambien juega un papel crucial en el manejo de la ansiedad. El ejercicio libera endorfinas, que son neurotransmisores que generan sensacion de bienestar. Incluso una caminata de 30 minutos puede marcar una diferencia significativa.",
      "Es importante recordar que buscar ayuda profesional no es un signo de debilidad, sino de fortaleza. Si la ansiedad esta afectando tu vida cotidiana, no dudes en contactar a un profesional de salud mental.",
    ],
  },
  {
    slug: "beneficios-terapia-pareja",
    title: "Beneficios de la terapia de pareja",
    excerpt:
      "La terapia de pareja no es solo para crisis. Descubre como puede fortalecer tu relacion y mejorar la comunicacion con tu pareja.",
    date: "8 Feb 2026",
    author: "Dr. Carlos Mendez",
    coverColor: "bg-accent",
    content: [
      "Muchas parejas creen que la terapia de pareja es un recurso de ultimo momento, reservado para relaciones al borde de la ruptura. Sin embargo, la terapia de pareja puede ser una herramienta preventiva increiblemente valiosa para cualquier relacion.",
      "Uno de los principales beneficios es la mejora en la comunicacion. Un terapeuta puede ayudar a identificar patrones de comunicacion daninos y ensenar nuevas formas de expresar necesidades y sentimientos de manera constructiva.",
      "La terapia tambien ayuda a resolver conflictos recurrentes. Muchas parejas se encuentran discutiendo los mismos temas una y otra vez. Un profesional puede facilitar la resolucion de estos conflictos subyacentes.",
      "Otro beneficio importante es el fortalecimiento de la conexion emocional. Con el tiempo, las parejas pueden distanciarse emocionalmente. La terapia ofrece un espacio seguro para reconectarse y profundizar el vinculo.",
      "Si estas considerando la terapia de pareja, recuerda que dar el primer paso es lo mas importante. No necesitas esperar a que haya una crisis para invertir en tu relacion.",
    ],
  },
  {
    slug: "mindfulness-para-principiantes",
    title: "Mindfulness para principiantes: guia practica",
    excerpt:
      "El mindfulness es una herramienta poderosa para reducir el estres. Aprende los fundamentos con esta guia paso a paso.",
    date: "1 Feb 2026",
    author: "Dra. Laura Jimenez",
    coverColor: "bg-primary-dark",
    content: [
      "El mindfulness, o atencion plena, es una practica que nos invita a estar presentes en el momento actual, sin juicios ni distracciones. Aunque tiene raices en tradiciones contemplativas milenarias, la ciencia moderna ha confirmado sus multiples beneficios para la salud mental.",
      "Para comenzar, busca un lugar tranquilo donde puedas sentarte comodamente. No necesitas una postura especial: lo importante es que estes comodo. Cierra los ojos suavemente y dirige tu atencion a tu respiracion.",
      "Observa como el aire entra y sale de tu cuerpo. No intentes cambiar tu respiracion, simplemente observala. Cuando tu mente divague (y lo hara), gentilmente redirige tu atencion a la respiracion. Este acto de redirigir es el ejercicio en si mismo.",
      "Comienza con sesiones de 5 minutos e incrementa gradualmente. La constancia es mas importante que la duracion. Es mejor meditar 5 minutos todos los dias que 30 minutos una vez por semana.",
      "Con la practica regular, notaras cambios significativos: mejor capacidad de concentracion, reduccion del estres, mayor claridad mental y una relacion mas saludable con tus emociones.",
    ],
  },
  {
    slug: "autoestima-saludable",
    title: "Construye una autoestima saludable",
    excerpt:
      "La autoestima influye en todos los aspectos de tu vida. Conoce estrategias efectivas para cultivar una imagen positiva de ti mismo.",
    date: "25 Ene 2026",
    author: "Dra. Maria Rodriguez",
    coverColor: "bg-secondary",
    content: [
      "La autoestima es la valoracion que hacemos de nosotros mismos. Una autoestima saludable no significa sentirse perfecto, sino aceptarse con fortalezas y debilidades, manteniendo una vision realista y compasiva de uno mismo.",
      "El primer paso para construir una autoestima saludable es identificar y desafiar los pensamientos negativos automaticos. Estos son juicios instantaneos que hacemos sobre nosotros mismos sin cuestionarlos.",
      "Practica la autocompasion: tratate con la misma amabilidad que le ofrecerias a un buen amigo. Cuando cometas un error, en lugar de criticarte duramente, reconoce que equivocarse es parte de ser humano.",
      "Establece metas realistas y celebra tus logros, por pequenos que sean. Cada paso cuenta en el camino hacia una mejor version de ti mismo.",
      "Recuerda que la autoestima se construye con el tiempo y la practica constante. Si sientes que tu autoestima afecta significativamente tu vida, un profesional puede ayudarte a desarrollar estrategias personalizadas.",
    ],
  },
  {
    slug: "estres-laboral",
    title: "Manejo del estres laboral",
    excerpt:
      "El estres en el trabajo puede afectar tu salud fisica y mental. Aprende a identificar las senales y a implementar cambios efectivos.",
    date: "18 Ene 2026",
    author: "Dr. Carlos Mendez",
    coverColor: "bg-primary",
    content: [
      "El estres laboral es una de las principales causas de malestar psicologico en la sociedad moderna. Reconocer sus senales tempranas es fundamental para poder abordarlo antes de que se convierta en un problema mayor.",
      "Entre las senales de alerta se encuentran: dificultad para concentrarse, irritabilidad, problemas de sueno, fatiga constante, y una sensacion de estar abrumado por las responsabilidades laborales.",
      "Una estrategia efectiva es establecer limites claros entre el trabajo y la vida personal. Esto incluye definir horarios, evitar revisar correos fuera del horario laboral y dedicar tiempo a actividades de ocio y descanso.",
      "La organizacion y priorizacion de tareas tambien puede reducir significativamente el estres. Utiliza herramientas de planificacion y aprende a delegar cuando sea posible.",
      "Si el estres laboral persiste a pesar de tus esfuerzos, considera hablar con un profesional. La terapia puede proporcionarte herramientas adicionales y un espacio seguro para explorar las causas subyacentes.",
    ],
  },
  {
    slug: "comunicacion-asertiva",
    title: "Comunicacion asertiva en tus relaciones",
    excerpt:
      "Aprender a comunicarte de forma asertiva puede transformar tus relaciones personales y profesionales. Descubre como lograrlo.",
    date: "10 Ene 2026",
    author: "Dra. Laura Jimenez",
    coverColor: "bg-accent",
    content: [
      "La comunicacion asertiva es la capacidad de expresar nuestras ideas, sentimientos y necesidades de manera clara, directa y respetuosa. No se trata de imponer nuestra opinion, sino de comunicarla de forma que sea escuchada.",
      "El primer paso es aprender a usar afirmaciones en primera persona. En lugar de decir 'Tu siempre llegas tarde', prueba con 'Me siento frustrado cuando los horarios no se respetan'. Esto reduce la defensividad del otro y abre espacio para el dialogo.",
      "Practicar la escucha activa es igualmente importante. Esto significa prestar atencion plena a lo que el otro dice, sin interrumpir ni preparar nuestra respuesta mientras habla.",
      "Aprender a decir 'no' de manera respetuosa es una habilidad crucial de la comunicacion asertiva. Establecer limites claros no es egoista; es necesario para mantener relaciones saludables.",
      "La comunicacion asertiva se desarrolla con la practica. Comienza en situaciones de baja presion y gradualmente aplica estas tecnicas en contextos mas desafiantes. Con el tiempo, se convertira en tu forma natural de comunicarte.",
    ],
  },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { name: true } } },
    });
    if (post) {
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        date: formatDate(post.createdAt),
        author: post.author.name || "Equipo Vital Emocion",
        coverColor: post.coverImage || "bg-primary",
        content: post.content.split("\n\n"),
      };
    }
  } catch {
    // Fall through to placeholder
  }
  return PLACEHOLDER_ARTICLES.find((a) => a.slug === slug) || null;
}

async function getRelatedArticles(currentSlug: string): Promise<Article[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", slug: { not: currentSlug } },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { author: { select: { name: true } } },
    });
    if (posts.length > 0) {
      return posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        date: formatDate(post.createdAt),
        author: post.author.name || "Equipo Vital Emocion",
        coverColor: post.coverImage || "bg-primary",
        content: post.content.split("\n\n"),
      }));
    }
  } catch {
    // Fall through to placeholder
  }
  return PLACEHOLDER_ARTICLES.filter((a) => a.slug !== currentSlug).slice(0, 2);
}

async function getAllSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    if (posts.length > 0) {
      return posts.map((p) => p.slug);
    }
  } catch {
    // Fall through to placeholder
  }
  return PLACEHOLDER_ARTICLES.map((a) => a.slug);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <section className="py-20 px-6 text-center">
        <h1 className="font-serif text-4xl text-text-primary">
          Articulo no encontrado
        </h1>
        <Link href="/blog" className="text-primary mt-4 inline-block">
          Volver al blog
        </Link>
      </section>
    );
  }

  const related = await getRelatedArticles(slug);

  return (
    <>
      <article className="max-w-3xl mx-auto py-20 px-6">
        <AnimatedSection animation="fade-up">
          <Link
            href="/blog"
            className="text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 text-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver al blog
          </Link>

          <h1 className="font-serif text-4xl text-text-primary mt-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 text-text-muted text-sm mt-4">
            <time>{article.date}</time>
            <span>·</span>
            <span>{article.author}</span>
          </div>

          <div className={`${article.coverColor} h-64 rounded-2xl mt-8`} />

          <div className="mt-10 space-y-6">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-text-secondary leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </AnimatedSection>
      </article>

      {/* Related articles */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="font-serif text-3xl text-text-primary text-center mb-10">
              Articulos relacionados
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {related.map((rel, index) => (
              <BlogCard key={rel.slug} {...rel} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
