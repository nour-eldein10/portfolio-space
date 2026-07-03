import { createServerFn } from "@tanstack/react-start";
import { sanityClient } from "./sanity";

export const fetchSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const query = `*[_type == "siteSettings"][0]`;
  const settings = await sanityClient.fetch(query);
  return settings || {
    lightTheme: 'theme-soft-cream',
    darkTheme: 'theme-dark-original'
  };
});
