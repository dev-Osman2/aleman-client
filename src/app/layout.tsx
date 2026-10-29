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
  themeColor: "#0fa396",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aleman.aswany.me"),
  title: {
    default: "مكتبة الإيمان | كتب إسلامية، علمية وثقافية",
    template: "%s | مكتبة الإيمان",
  },
  description:
    "مكتبة الإيمان - وجهتك الأولى للكتب الإسلامية، التراثية، العلمية والأدبية. تصفح أحدث الإصدارات واطلب كتبك المفضلة أونلاين بسهولة وتوصيل سريع.",
  keywords: [
    "مكتبة الإيمان",
    "كتب إسلامية",
    "كتب تراث",
    "فقه",
    "عقيدة",
    "تفسير",
    "روايات",
    "شراء كتب أونلاين",
    "مكتبة",
    "كتب",
  ],
  alternates: {
    canonical: "/",
  },
  
  verification: {
    google: "SG56LKgfX5LA3jQGAVaIks0hoCdhXLe4Dr0P18r6N3k",
  },

  openGraph: {
    title: "مكتبة الإيمان | صرح الثقافة والكتب الإسلامية",
    description:
      "تصفح واطلب أحدث الكتب والمؤلفات الإسلامية والعلمية أونلاين من مكتبة الإيمان مع خدمة التوصيل السريع.",
    url: "https://aleman.aswany.me",
    siteName: "مكتبة الإيمان",
    images: [
      {
        url: "/logo.webp",
        width: 800,
        height: 600,
        alt: "شعار مكتبة الإيمان",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "مكتبة الإيمان | كتب إسلامية وعلمية",
    description:
      "اطلب كتبك ومراجعك المفضلة أونلاين من مكتبة الإيمان بأفضل الأسعار وأسرع توصيل.",
    images: ["/logo.webp"],
  },

  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body
        className={`${tajawal.className} bg-lightBg text-gray-800 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <Footer />
            <Toaster position="bottom-left" richColors dir="rtl" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
