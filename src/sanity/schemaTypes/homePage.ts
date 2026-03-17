import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Pagina de inicio",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titulo del hero",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtitulo del hero",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "servicesEyebrow",
      title: "Eyebrow de servicios",
      type: "string",
    }),
    defineField({
      name: "servicesHeading",
      title: "Titulo de servicios",
      type: "string",
    }),
    defineField({
      name: "serviceHighlights",
      title: "Servicios destacados",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titulo",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Descripcion",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "testimonialsHeading",
      title: "Titulo de testimonios",
      type: "string",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonios",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Testimonio",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "quote",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "ctaTitle",
      title: "Titulo del CTA",
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "Descripcion del CTA",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "Texto del boton",
      type: "string",
    }),
    defineField({
      name: "ctaButtonHref",
      title: "Enlace del boton",
      type: "string",
      initialValue: "/agendar",
    }),
  ],
});
