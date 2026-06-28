import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient: SanityClient = createClient({
  projectId: "9sivjnx4",
  dataset: "production",
  apiVersion: "2024-06-01",
  useCdn: true,
  token:
    "sklDmNsBDpt5VJnzrcYWQvf4nB7KA66bFkVpwoiUa9G0akfok9RDWmFl5wKbwZYBzxBzef7R4czDtkm7DyLpfhQAvJ2EBDiELoU3U2ttt85nMJhtqeC1DBqKmjLrUarfvJNcSY0jo6hAR7SJKtCctxztrDwJDUwqdxbSfQOLiAjV6a2Myot2",
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
