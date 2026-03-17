import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "../env";

const builder = createImageUrlBuilder({
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset || "production",
});

export function urlForImage(source: unknown) {
  return builder.image(source as never);
}
