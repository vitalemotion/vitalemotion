import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Pagina nosotros",
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
      name: "missionEyebrow",
      title: "Eyebrow de mision",
      type: "string",
    }),
    defineField({
      name: "missionText",
      title: "Texto de mision",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "teamHeading",
      title: "Titulo de equipo",
      type: "string",
    }),
    defineField({
      name: "philosophyTitle",
      title: "Titulo de filosofia",
      type: "string",
    }),
    defineField({
      name: "philosophyParagraphs",
      title: "Parrafos de filosofia",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
  ],
});
