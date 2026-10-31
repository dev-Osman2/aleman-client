import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "دار الإيمان",
    short_name: "دار الإيمان",
    description: "خير جليس في الزمان كتاب",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F3F3",
    theme_color: "#0fa396",
    icons: [
      {
        src: "/logo.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/logo.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/logo.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
