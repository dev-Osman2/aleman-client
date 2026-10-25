import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

const tajawal = localFont({
  src: [
    {
      path: "./fonts/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://saraya.aswany.me"),
  title: {
    default: "مطعم السرايا | أشهى المأكولات والمشويات",
    template: "%s | مطعم السرايا",
  },
  description:
    "مطعم السرايا - أشهى المأكولات والمشويات الطازجة. اطلب وجبتك المفضلة أونلاين بسهولة وتوصيل سريع.",
  keywords: [
    "مطعم السرايا",
    "مشويات",
    "حواوشي",
    "سجق",
    "وجبات",
    "سندوتشات",
    "مأكولات",
    "توصيل طعام",
    "الأقصر",
  ],
  alternates: {
    canonical: "/",
  },

  verification: {
    google: "SG56LKgfX5LA3jQGAVaIks0hoCdhXLe4Dr0P18r6N3k",
  },

  openGraph: {
    title: "مطعم السرايا | أشهى المأكولات والمشويات",
    description:
      "اطلب الآن أشهى المأكولات والمشويات الطازجة من مطعم السرايا أونلاين بأسرع توصيل.",
    url: "https://saraya.aswany.me",
    siteName: "مطعم السرايا",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "شعار مطعم السرايا",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "مطعم السرايا | أشهى المأكولات والمشويات",
    description: "اطلب الآن وجبتك المفضلة من مطعم السرايا أونلاين.",
    images: ["/logo.png"],
  },

  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.className} bg-lightBg text-gray-800 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <Footer />
            <Toaster position="top-center" richColors dir="rtl" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
