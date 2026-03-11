import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding database...");

  // -----------------------------------------------------------------------
  // 1. Admin user
  // -----------------------------------------------------------------------
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vitalemocion.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@vitalemocion.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.id);

  // -----------------------------------------------------------------------
  // 2. Psychologists (User + Psychologist)
  // -----------------------------------------------------------------------
  const psychPassword = await hash("psych123", 12);

  const mariaUser = await prisma.user.upsert({
    where: { email: "maria@vitalemocion.com" },
    update: {},
    create: {
      name: "Dra. Maria Rodriguez",
      email: "maria@vitalemocion.com",
      passwordHash: psychPassword,
      role: "PSYCHOLOGIST",
    },
  });
  const mariaPsy = await prisma.psychologist.upsert({
    where: { userId: mariaUser.id },
    update: {},
    create: {
      userId: mariaUser.id,
      specialties: ["Ansiedad", "Depresion", "Estres"],
      bio: "Con mas de 10 anos de experiencia en psicologia clinica, la Dra. Rodriguez se especializa en el tratamiento de trastornos de ansiedad y depresion. Su enfoque integrador combina terapia cognitivo-conductual con tecnicas de mindfulness.",
      isActive: true,
    },
  });

  const carlosUser = await prisma.user.upsert({
    where: { email: "carlos@vitalemocion.com" },
    update: {},
    create: {
      name: "Dr. Carlos Mendez",
      email: "carlos@vitalemocion.com",
      passwordHash: psychPassword,
      role: "PSYCHOLOGIST",
    },
  });
  const carlosPsy = await prisma.psychologist.upsert({
    where: { userId: carlosUser.id },
    update: {},
    create: {
      userId: carlosUser.id,
      specialties: ["Terapia de Pareja", "Comunicacion", "Familia"],
      bio: "El Dr. Mendez ha dedicado su carrera a fortalecer las relaciones de pareja. Utiliza un enfoque basado en la Terapia Focalizada en las Emociones para ayudar a las parejas a reconectarse y construir vinculos mas solidos.",
      isActive: true,
    },
  });

  const lauraUser = await prisma.user.upsert({
    where: { email: "laura@vitalemocion.com" },
    update: {},
    create: {
      name: "Dra. Laura Jimenez",
      email: "laura@vitalemocion.com",
      passwordHash: psychPassword,
      role: "PSYCHOLOGIST",
    },
  });
  const lauraPsy = await prisma.psychologist.upsert({
    where: { userId: lauraUser.id },
    update: {},
    create: {
      userId: lauraUser.id,
      specialties: ["Ninos", "Adolescentes", "Familia"],
      bio: "Especialista en psicologia infantil y del adolescente, la Dra. Jimenez trabaja con un enfoque ludico y centrado en la familia. Su objetivo es crear un espacio seguro donde los mas jovenes puedan expresarse libremente.",
      isActive: true,
    },
  });

  console.log("Psychologists created:", mariaPsy.id, carlosPsy.id, lauraPsy.id);

  // -----------------------------------------------------------------------
  // 3. Services
  // -----------------------------------------------------------------------
  const servicesData = [
    {
      name: "Terapia Individual",
      description:
        "Sesiones de 50 minutos enfocadas en tus necesidades personales. Trabajamos con tecnicas cognitivo-conductuales y humanistas.",
      duration: 50,
      price: 80000,
      psychologists: [mariaPsy.id, carlosPsy.id, lauraPsy.id],
    },
    {
      name: "Terapia de Pareja",
      description:
        "Mejora la comunicacion y fortalece tu relacion. Sesiones de 90 minutos para parejas.",
      duration: 90,
      price: 120000,
      psychologists: [carlosPsy.id],
    },
    {
      name: "Evaluacion Psicologica",
      description:
        "Evaluacion integral con pruebas estandarizadas para un diagnostico preciso.",
      duration: 120,
      price: 150000,
      psychologists: [mariaPsy.id, carlosPsy.id],
    },
    {
      name: "Talleres de Mindfulness",
      description:
        "Grupos reducidos para aprender tecnicas de mindfulness y reduccion de estres.",
      duration: 60,
      price: 40000,
      psychologists: [mariaPsy.id, lauraPsy.id],
    },
    {
      name: "Terapia Infantil",
      description:
        "Intervencion especializada para ninos y adolescentes con enfoque ludico.",
      duration: 45,
      price: 70000,
      psychologists: [lauraPsy.id],
    },
    {
      name: "Coaching de Vida",
      description:
        "Acompanamiento profesional para alcanzar tus metas personales y profesionales.",
      duration: 50,
      price: 90000,
      psychologists: [mariaPsy.id, carlosPsy.id],
    },
  ];

  const services = [];
  for (const svc of servicesData) {
    const service = await prisma.service.upsert({
      where: {
        id: slugify(svc.name), // use a stable id based on name
      },
      update: {
        name: svc.name,
        description: svc.description,
        duration: svc.duration,
        price: svc.price,
        psychologists: {
          set: svc.psychologists.map((id) => ({ id })),
        },
      },
      create: {
        id: slugify(svc.name),
        name: svc.name,
        description: svc.description,
        duration: svc.duration,
        price: svc.price,
        psychologists: {
          connect: svc.psychologists.map((id) => ({ id })),
        },
      },
    });
    services.push(service);
  }
  console.log("Services created:", services.length);

  // -----------------------------------------------------------------------
  // 4. Products
  // -----------------------------------------------------------------------
  const productsData = [
    {
      name: "El Arte de la Calma",
      price: 45000,
      type: "PHYSICAL" as const,
      category: "Libros",
      images: ["#A8C5B8"],
      tags: ["bienestar", "calma"],
      description:
        "Una guia completa para encontrar paz interior en medio del caos cotidiano. Este libro te ofrece herramientas practicas para cultivar la serenidad y mejorar tu calidad de vida a traves de ejercicios de respiracion, meditacion y reflexion.",
      stock: 50,
    },
    {
      name: "Guia de Mindfulness",
      price: 25000,
      type: "DIGITAL" as const,
      category: "Digital",
      images: ["#D4B896"],
      tags: ["mindfulness", "meditacion"],
      description:
        "Descarga inmediata de nuestra guia digital de mindfulness. Incluye 30 ejercicios practicos, meditaciones guiadas en audio y un plan de 21 dias para incorporar la atencion plena en tu rutina diaria.",
    },
    {
      name: "Diario de Emociones",
      price: 35000,
      type: "PHYSICAL" as const,
      category: "Materiales",
      images: ["#C4916E"],
      tags: ["emociones", "diario"],
      description:
        "Un hermoso diario disenado especificamente para el registro y exploracion de tus emociones. Con prompts diarios, espacios para reflexion y ejercicios de autoconocimiento.",
      stock: 30,
    },
    {
      name: "Taller de Autoestima (Video)",
      price: 60000,
      type: "DIGITAL" as const,
      category: "Digital",
      images: ["#B8A8C5"],
      tags: ["autoestima", "taller"],
      description:
        "Acceso inmediato a nuestro taller en video sobre autoestima. 6 modulos con mas de 4 horas de contenido, ejercicios practicos y material complementario.",
    },
    {
      name: "Manual de Terapia Cognitiva",
      price: 55000,
      type: "PHYSICAL" as const,
      category: "Libros",
      images: ["#7C9A8E"],
      tags: ["terapia", "cognitiva"],
      description:
        "Manual completo de tecnicas de terapia cognitivo-conductual adaptado para el autoconocimiento. Incluye ejercicios, cuestionarios y estrategias comprobadas.",
      stock: 25,
    },
    {
      name: "Meditaciones Guiadas",
      price: 20000,
      type: "DIGITAL" as const,
      category: "Digital",
      images: ["#96B8D4"],
      tags: ["meditacion", "audio"],
      description:
        "Coleccion de 15 meditaciones guiadas en formato digital. Desde relajacion profunda hasta visualizacion creativa.",
    },
    {
      name: "Cuaderno de Gratitud",
      price: 30000,
      type: "PHYSICAL" as const,
      category: "Materiales",
      images: ["#D4C896"],
      tags: ["gratitud", "bienestar"],
      description:
        "Un cuaderno bellamente ilustrado para practicar la gratitud diaria. Con espacios para escribir, reflexionar y visualizar lo positivo en tu vida.",
      stock: 40,
    },
    {
      name: "Curso: Inteligencia Emocional",
      price: 80000,
      type: "DIGITAL" as const,
      category: "Digital",
      images: ["#C5A8B8"],
      tags: ["inteligencia emocional", "curso"],
      description:
        "Curso digital completo de inteligencia emocional. 8 modulos, mas de 10 horas de contenido en video, cuadernos de trabajo descargables.",
    },
    {
      name: "El Camino del Autoconocimiento",
      price: 50000,
      type: "PHYSICAL" as const,
      category: "Libros",
      images: ["#8EB89A"],
      tags: ["autoconocimiento", "desarrollo personal"],
      description:
        "Un viaje literario hacia el autoconocimiento profundo. Este libro combina filosofia, psicologia y ejercicios practicos.",
      stock: 35,
    },
    {
      name: "Kit de Relajacion",
      price: 40000,
      type: "PHYSICAL" as const,
      category: "Materiales",
      images: ["#B8C5A8"],
      tags: ["relajacion", "kit"],
      description:
        "Kit completo para tus sesiones de relajacion en casa. Incluye guia impresa, tarjetas de afirmaciones positivas y un plan de 30 dias.",
      stock: 20,
    },
  ];

  const products = [];
  for (const prod of productsData) {
    const slug = slugify(prod.name);
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        type: prod.type,
        category: prod.category,
        images: prod.images,
        tags: prod.tags,
        stock: prod.stock ?? null,
      },
      create: {
        name: prod.name,
        slug,
        description: prod.description,
        price: prod.price,
        type: prod.type,
        category: prod.category,
        images: prod.images,
        tags: prod.tags,
        stock: prod.stock ?? null,
      },
    });
    products.push(product);
  }
  console.log("Products created:", products.length);

  // -----------------------------------------------------------------------
  // 5. Blog Posts
  // -----------------------------------------------------------------------
  const blogPostsData = [
    {
      title: "Como manejar la ansiedad en el dia a dia",
      slug: "como-manejar-la-ansiedad",
      excerpt:
        "Descubre tecnicas practicas para gestionar la ansiedad y recuperar el control de tu bienestar emocional en situaciones cotidianas.",
      content:
        "La ansiedad es una respuesta natural del cuerpo ante situaciones de estres o peligro. Sin embargo, cuando se vuelve cronica, puede afectar significativamente nuestra calidad de vida. En este articulo, exploraremos tecnicas practicas y basadas en evidencia para manejar la ansiedad en tu dia a dia.\n\nUna de las tecnicas mas efectivas es la respiracion diafragmatica. Esta tecnica consiste en respirar profundamente, expandiendo el abdomen en lugar del pecho. Practica inhalar durante 4 segundos, sostener durante 4 segundos y exhalar durante 6 segundos. Repite este ciclo durante 5 minutos.\n\nEl mindfulness o atencion plena es otra herramienta poderosa. Consiste en prestar atencion al momento presente sin juzgar. Puedes comenzar con ejercicios simples como observar tu respiracion durante unos minutos cada dia.\n\nLa actividad fisica regular tambien juega un papel crucial en el manejo de la ansiedad. El ejercicio libera endorfinas, que son neurotransmisores que generan sensacion de bienestar. Incluso una caminata de 30 minutos puede marcar una diferencia significativa.\n\nEs importante recordar que buscar ayuda profesional no es un signo de debilidad, sino de fortaleza. Si la ansiedad esta afectando tu vida cotidiana, no dudes en contactar a un profesional de salud mental.",
      coverImage: "bg-primary",
      authorId: mariaUser.id,
      status: "PUBLISHED" as const,
    },
    {
      title: "Beneficios de la terapia de pareja",
      slug: "beneficios-terapia-pareja",
      excerpt:
        "La terapia de pareja no es solo para crisis. Descubre como puede fortalecer tu relacion y mejorar la comunicacion con tu pareja.",
      content:
        "Muchas parejas creen que la terapia de pareja es un recurso de ultimo momento, reservado para relaciones al borde de la ruptura. Sin embargo, la terapia de pareja puede ser una herramienta preventiva increiblemente valiosa para cualquier relacion.\n\nUno de los principales beneficios es la mejora en la comunicacion. Un terapeuta puede ayudar a identificar patrones de comunicacion daninos y ensenar nuevas formas de expresar necesidades y sentimientos de manera constructiva.\n\nLa terapia tambien ayuda a resolver conflictos recurrentes. Muchas parejas se encuentran discutiendo los mismos temas una y otra vez. Un profesional puede facilitar la resolucion de estos conflictos subyacentes.\n\nOtro beneficio importante es el fortalecimiento de la conexion emocional. Con el tiempo, las parejas pueden distanciarse emocionalmente. La terapia ofrece un espacio seguro para reconectarse y profundizar el vinculo.\n\nSi estas considerando la terapia de pareja, recuerda que dar el primer paso es lo mas importante. No necesitas esperar a que haya una crisis para invertir en tu relacion.",
      coverImage: "bg-accent",
      authorId: carlosUser.id,
      status: "PUBLISHED" as const,
    },
    {
      title: "Mindfulness para principiantes: guia practica",
      slug: "mindfulness-para-principiantes",
      excerpt:
        "El mindfulness es una herramienta poderosa para reducir el estres. Aprende los fundamentos con esta guia paso a paso.",
      content:
        "El mindfulness, o atencion plena, es una practica que nos invita a estar presentes en el momento actual, sin juicios ni distracciones. Aunque tiene raices en tradiciones contemplativas milenarias, la ciencia moderna ha confirmado sus multiples beneficios para la salud mental.\n\nPara comenzar, busca un lugar tranquilo donde puedas sentarte comodamente. No necesitas una postura especial: lo importante es que estes comodo. Cierra los ojos suavemente y dirige tu atencion a tu respiracion.\n\nObserva como el aire entra y sale de tu cuerpo. No intentes cambiar tu respiracion, simplemente observala. Cuando tu mente divague (y lo hara), gentilmente redirige tu atencion a la respiracion. Este acto de redirigir es el ejercicio en si mismo.\n\nComienza con sesiones de 5 minutos e incrementa gradualmente. La constancia es mas importante que la duracion. Es mejor meditar 5 minutos todos los dias que 30 minutos una vez por semana.\n\nCon la practica regular, notaras cambios significativos: mejor capacidad de concentracion, reduccion del estres, mayor claridad mental y una relacion mas saludable con tus emociones.",
      coverImage: "bg-primary-dark",
      authorId: lauraUser.id,
      status: "PUBLISHED" as const,
    },
    {
      title: "Construye una autoestima saludable",
      slug: "autoestima-saludable",
      excerpt:
        "La autoestima influye en todos los aspectos de tu vida. Conoce estrategias efectivas para cultivar una imagen positiva de ti mismo.",
      content:
        "La autoestima es la valoracion que hacemos de nosotros mismos. Una autoestima saludable no significa sentirse perfecto, sino aceptarse con fortalezas y debilidades, manteniendo una vision realista y compasiva de uno mismo.\n\nEl primer paso para construir una autoestima saludable es identificar y desafiar los pensamientos negativos automaticos. Estos son juicios instantaneos que hacemos sobre nosotros mismos sin cuestionarlos.\n\nPractica la autocompasion: tratate con la misma amabilidad que le ofrecerias a un buen amigo. Cuando cometas un error, en lugar de criticarte duramente, reconoce que equivocarse es parte de ser humano.\n\nEstablece metas realistas y celebra tus logros, por pequenos que sean. Cada paso cuenta en el camino hacia una mejor version de ti mismo.\n\nRecuerda que la autoestima se construye con el tiempo y la practica constante. Si sientes que tu autoestima afecta significativamente tu vida, un profesional puede ayudarte a desarrollar estrategias personalizadas.",
      coverImage: "bg-secondary",
      authorId: mariaUser.id,
      status: "PUBLISHED" as const,
    },
    {
      title: "Manejo del estres laboral",
      slug: "estres-laboral",
      excerpt:
        "El estres en el trabajo puede afectar tu salud fisica y mental. Aprende a identificar las senales y a implementar cambios efectivos.",
      content:
        "El estres laboral es una de las principales causas de malestar psicologico en la sociedad moderna. Reconocer sus senales tempranas es fundamental para poder abordarlo antes de que se convierta en un problema mayor.\n\nEntre las senales de alerta se encuentran: dificultad para concentrarse, irritabilidad, problemas de sueno, fatiga constante, y una sensacion de estar abrumado por las responsabilidades laborales.\n\nUna estrategia efectiva es establecer limites claros entre el trabajo y la vida personal. Esto incluye definir horarios, evitar revisar correos fuera del horario laboral y dedicar tiempo a actividades de ocio y descanso.\n\nLa organizacion y priorizacion de tareas tambien puede reducir significativamente el estres. Utiliza herramientas de planificacion y aprende a delegar cuando sea posible.\n\nSi el estres laboral persiste a pesar de tus esfuerzos, considera hablar con un profesional. La terapia puede proporcionarte herramientas adicionales y un espacio seguro para explorar las causas subyacentes.",
      coverImage: "bg-primary",
      authorId: carlosUser.id,
      status: "DRAFT" as const,
    },
    {
      title: "Comunicacion asertiva en tus relaciones",
      slug: "comunicacion-asertiva",
      excerpt:
        "Aprender a comunicarte de forma asertiva puede transformar tus relaciones personales y profesionales. Descubre como lograrlo.",
      content:
        "La comunicacion asertiva es la capacidad de expresar nuestras ideas, sentimientos y necesidades de manera clara, directa y respetuosa. No se trata de imponer nuestra opinion, sino de comunicarla de forma que sea escuchada.\n\nEl primer paso es aprender a usar afirmaciones en primera persona. En lugar de decir 'Tu siempre llegas tarde', prueba con 'Me siento frustrado cuando los horarios no se respetan'. Esto reduce la defensividad del otro y abre espacio para el dialogo.\n\nPracticar la escucha activa es igualmente importante. Esto significa prestar atencion plena a lo que el otro dice, sin interrumpir ni preparar nuestra respuesta mientras habla.\n\nAprender a decir 'no' de manera respetuosa es una habilidad crucial de la comunicacion asertiva. Establecer limites claros no es egoista; es necesario para mantener relaciones saludables.\n\nLa comunicacion asertiva se desarrolla con la practica. Comienza en situaciones de baja presion y gradualmente aplica estas tecnicas en contextos mas desafiantes. Con el tiempo, se convertira en tu forma natural de comunicarte.",
      coverImage: "bg-accent",
      authorId: lauraUser.id,
      status: "DRAFT" as const,
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        authorId: post.authorId,
        status: post.status,
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        authorId: post.authorId,
        status: post.status,
      },
    });
  }
  console.log("Blog posts created:", blogPostsData.length);

  // -----------------------------------------------------------------------
  // 6. Sample Patients (User + Patient)
  // -----------------------------------------------------------------------
  const patientPassword = await hash("patient123", 12);

  const mariaGarciaUser = await prisma.user.upsert({
    where: { email: "maria.garcia@email.com" },
    update: {},
    create: {
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      passwordHash: patientPassword,
      role: "PATIENT",
    },
  });
  const mariaGarciaPatient = await prisma.patient.upsert({
    where: { userId: mariaGarciaUser.id },
    update: {},
    create: {
      userId: mariaGarciaUser.id,
      phone: "+57 300 111 2222",
    },
  });

  const andresUser = await prisma.user.upsert({
    where: { email: "andres@email.com" },
    update: {},
    create: {
      name: "Andres Martinez",
      email: "andres@email.com",
      passwordHash: patientPassword,
      role: "PATIENT",
    },
  });
  const andresPatient = await prisma.patient.upsert({
    where: { userId: andresUser.id },
    update: {},
    create: {
      userId: andresUser.id,
      phone: "+57 310 333 4444",
    },
  });

  console.log("Patients created:", mariaGarciaPatient.id, andresPatient.id);

  // -----------------------------------------------------------------------
  // 7. Sample Appointments
  // -----------------------------------------------------------------------
  const now = new Date();

  // Upcoming - 3 days from now
  const upcoming1Start = new Date(now);
  upcoming1Start.setDate(upcoming1Start.getDate() + 3);
  upcoming1Start.setHours(10, 0, 0, 0);
  const upcoming1End = new Date(upcoming1Start);
  upcoming1End.setMinutes(upcoming1End.getMinutes() + 50);

  // Upcoming - 5 days from now
  const upcoming2Start = new Date(now);
  upcoming2Start.setDate(upcoming2Start.getDate() + 5);
  upcoming2Start.setHours(14, 0, 0, 0);
  const upcoming2End = new Date(upcoming2Start);
  upcoming2End.setMinutes(upcoming2End.getMinutes() + 90);

  // Past completed - 7 days ago
  const past1Start = new Date(now);
  past1Start.setDate(past1Start.getDate() - 7);
  past1Start.setHours(11, 0, 0, 0);
  const past1End = new Date(past1Start);
  past1End.setMinutes(past1End.getMinutes() + 50);

  // Past cancelled - 14 days ago
  const past2Start = new Date(now);
  past2Start.setDate(past2Start.getDate() - 14);
  past2Start.setHours(16, 0, 0, 0);
  const past2End = new Date(past2Start);
  past2End.setMinutes(past2End.getMinutes() + 60);

  // Delete existing sample appointments to make idempotent
  await prisma.appointment.deleteMany({
    where: {
      patientId: { in: [mariaGarciaPatient.id, andresPatient.id] },
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: mariaGarciaPatient.id,
        psychologistId: mariaPsy.id,
        serviceId: services[0].id, // Terapia Individual
        startTime: upcoming1Start,
        endTime: upcoming1End,
        status: "CONFIRMED",
      },
      {
        patientId: andresPatient.id,
        psychologistId: carlosPsy.id,
        serviceId: services[1].id, // Terapia de Pareja
        startTime: upcoming2Start,
        endTime: upcoming2End,
        status: "CONFIRMED",
      },
      {
        patientId: mariaGarciaPatient.id,
        psychologistId: mariaPsy.id,
        serviceId: services[0].id, // Terapia Individual
        startTime: past1Start,
        endTime: past1End,
        status: "COMPLETED",
      },
      {
        patientId: andresPatient.id,
        psychologistId: lauraPsy.id,
        serviceId: services[3].id, // Talleres de Mindfulness
        startTime: past2Start,
        endTime: past2End,
        status: "CANCELLED",
      },
    ],
  });
  console.log("Appointments created: 4");

  // -----------------------------------------------------------------------
  // 8. Sample Orders
  // -----------------------------------------------------------------------

  // Delete existing sample orders to make idempotent
  await prisma.orderItem.deleteMany({
    where: { order: { patientId: { in: [mariaGarciaPatient.id, andresPatient.id] } } },
  });
  await prisma.order.deleteMany({
    where: { patientId: { in: [mariaGarciaPatient.id, andresPatient.id] } },
  });

  // Order 1: PAID with digital items
  const order1 = await prisma.order.create({
    data: {
      patientId: mariaGarciaPatient.id,
      status: "PAID",
      subtotal: 85000,
      shippingCost: 0,
      total: 85000,
      paypalOrderId: "PAYPAL-MOCK-001",
      items: {
        create: [
          { productId: products[1].id, quantity: 1, price: products[1].price }, // Guia de Mindfulness
          { productId: products[3].id, quantity: 1, price: products[3].price }, // Taller de Autoestima
        ],
      },
    },
  });

  // Order 2: SHIPPED with physical items
  const order2 = await prisma.order.create({
    data: {
      patientId: andresPatient.id,
      status: "SHIPPED",
      subtotal: 80000,
      shippingCost: 8000,
      total: 88000,
      paypalOrderId: "PAYPAL-MOCK-002",
      shippingAddress: {
        street: "Carrera 7 #45-10",
        city: "Bogota",
        state: "Cundinamarca",
        zip: "110111",
        country: "Colombia",
      },
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: products[0].price }, // El Arte de la Calma
          { productId: products[2].id, quantity: 1, price: products[2].price }, // Diario de Emociones
        ],
      },
    },
  });

  // Order 3: DELIVERED with mixed items
  const order3 = await prisma.order.create({
    data: {
      patientId: mariaGarciaPatient.id,
      status: "DELIVERED",
      subtotal: 95000,
      shippingCost: 8000,
      total: 103000,
      paypalOrderId: "PAYPAL-MOCK-003",
      shippingAddress: {
        street: "Calle 93 #14-20",
        city: "Bogota",
        state: "Cundinamarca",
        zip: "110221",
        country: "Colombia",
      },
      items: {
        create: [
          { productId: products[4].id, quantity: 1, price: products[4].price }, // Manual de Terapia Cognitiva
          { productId: products[5].id, quantity: 2, price: products[5].price }, // Meditaciones Guiadas x2
        ],
      },
    },
  });

  console.log("Orders created:", order1.id, order2.id, order3.id);

  // -----------------------------------------------------------------------
  // 9. SiteConfig entries
  // -----------------------------------------------------------------------
  const siteConfigEntries = [
    { key: "practice_name", value: "Vital Emocion" },
    { key: "practice_description", value: "Centro de bienestar psicologico" },
    { key: "phone", value: "+57 300 123 4567" },
    { key: "email", value: "contacto@vitalemocion.com" },
    { key: "address", value: "Calle 100 #15-20, Bogota, Colombia" },
    { key: "whatsapp_number", value: "+573001234567" },
    {
      key: "social_media",
      value: { instagram: "@vitalemocion", facebook: "vitalemocion" },
    },
    {
      key: "business_hours",
      value:
        "Lunes a Viernes: 8:00 AM - 6:00 PM, Sabados: 9:00 AM - 1:00 PM",
    },
  ];

  for (const entry of siteConfigEntries) {
    await prisma.siteConfig.upsert({
      where: { key: entry.key },
      update: { value: entry.value as never },
      create: { key: entry.key, value: entry.value as never },
    });
  }
  console.log("SiteConfig entries created:", siteConfigEntries.length);

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
