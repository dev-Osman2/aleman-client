import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مكتبة الإيمان",
    short_name: "مكتبة الإيمان",
    description: "خير جليس في الزمان كتاب",
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