import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Configuracion del sitio",
  type: "document",
  fields: [
    defineField({
      name: "practiceName",
      title: "Nombre del sitio",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripcion corta",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerDescription",
      title: "Descripcion para footer",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "contactEmail",
      title: "Email de contacto",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Telefono principal",
      type: "string",
    }),
    defineField({
      name: "secondaryPhone",
      title: "Telefono secundario",
      type: "string",
    }),
    defineField({
      name: "whatsappNumber",
      title: "Numero de WhatsApp",
      description: "Solo numeros o formato internacional. Se usa para el boton flotante.",
      type: "string",
    }),
    defineField({
      name: "addressLine1",
      title: "Direccion linea 1",
      type: "string",
    }),
    defineField({
      name: "addressLine2",
      title: "Direccion linea 2",
      type: "string",
    }),
    defineField({
      name: "businessHours",
      title: "Horario",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "socialInstagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "socialFacebook",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "socialLinkedin",
      title: "LinkedIn",
      type: "url",
    }),
    defineField({
      name: "socialWhatsapp",
      title: "Enlace publico de WhatsApp",
      type: "url",
    }),
    defineField({
      name: "footerServices",
      title: "Servicios destacados en footer",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "copyrightText",
      title: "Texto legal del footer",
      type: "string",
    }),
  ],
});
