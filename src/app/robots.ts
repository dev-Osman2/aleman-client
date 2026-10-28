import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://aleman.aswany.me";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/lib", "/lib/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
