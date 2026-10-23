import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مطعم سرايا",
    short_name: "السرايا",
    description: "أشهى المأكولات والمشويات الطازجة.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F4F6",
    theme_color: "#ea580c",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", 
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable", 
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any", 
      },
    ],
  };
}