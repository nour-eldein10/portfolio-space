import { createClient } from "@sanity/client";

/**
 * Server-only Sanity client with write access.
 * Never import this from client code — keep it inside server-function handlers.
 */
export function getSanityWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_WRITE_TOKEN is not configured");
  return createClient({
    projectId: "9sivjnx4",
    dataset: "production",
    apiVersion: "2024-06-01",
    token,
    useCdn: false,
    perspective: "published",
  });
}