import type { StructureResolver } from "sanity/structure";

export const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Configuracion del sitio")
        .id("siteSettings")
        .child(S.editor().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Pagina de inicio")
        .id("homePage")
        .child(S.editor().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Pagina nosotros")
        .id("aboutPage")
        .child(S.editor().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() === "post"),
    ]);
