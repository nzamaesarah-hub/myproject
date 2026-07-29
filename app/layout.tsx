import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// font display bulat & tebal, dipakai untuk judul-judul besar (PORTFOLIO, ABOUT ME, dst)
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

// font body untuk paragraf/navbar/deskripsi
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Nama Kamu — Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${baloo.variable} ${inter.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
