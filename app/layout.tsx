import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Created with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Navigasi / Navbar */}
        <nav className="bg-white shadow-md p-4 flex gap-6 justify-center">
          <Link href="/" className="font-semibold hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/profile" className="font-semibold hover:text-blue-600 transition">
            Profile
          </Link>
          <Link href="/portfolio" className="font-semibold hover:text-blue-600 transition">
            Portfolio
          </Link>
        </nav>

        {/* Konten Halaman akan muncul di sini */}
        <main className="p-8 max-w-4xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}