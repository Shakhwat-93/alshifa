import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const notoBengali = Noto_Sans_Bengali({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shifabd.online"),
  title: "শিফা পেইন কেয়ার অয়েল | ব্যথামুক্ত স্বাভাবিক জীবনের নিশ্চয়তা",
  description:
    "হাঁটু, কোমর, ঘাড় ও জয়েন্টের দীর্ঘদিনের ব্যথায় ঘরোয়া স্থায়ী সমাধান। ২৭টি দুর্লভ ভেষজ উপাদানে তৈরি ১০০% অরিজিনাল শিফা পেইন কেয়ার অয়েল। সারাদেশে ক্যাশ অন হোম ডেলিভারি।",
  keywords: [
    "শিফা পেইন কেয়ার অয়েল",
    "Shifa Pain Care Oil",
    "বাতের ব্যথার তেল",
    "হাঁটু ব্যথার মালিশ তেল",
    "কোমর ব্যথার প্রাকৃতিক সমাধান",
    "পেইন রিলিফ অয়েল বাংলাদেশ",
  ],
  openGraph: {
    title: "শিফা পেইন কেয়ার অয়েল | মাত্র ১০ মিনিটে জয়েন্ট ও মাংসপেশির ব্যথায় স্থায়ী আরাম",
    description: "পেইনকিলারের ক্ষতিকর পার্শ্বপ্রতিক্রিয়া ভুলে প্রকৃতির স্পর্শে ব্যথামুক্ত থাকুন। ক্যাশ অন ডেলিভারি সুবিধা।",
    url: "https://shifabd.online",
    siteName: "Shifa Care BD",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "শিফা পেইন কেয়ার অয়েল",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#064e3b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${notoBengali.variable} ${plusJakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#fcfcfb] text-[#1c1917] selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-0 font-bengali">
        {children}
      </body>
    </html>
  );
}
