"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-sky/10 bg-navy/70 px-4 py-2 backdrop-blur">
        <Link
          href="/"
          className="rounded-full bg-panel px-4 py-2 font-display text-sm font-semibold tracking-wide"
        >
          Nama Kamu
        </Link>

        {/* menu desktop */}
        <ul className="hidden gap-1 font-body text-sm md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-4 py-2 transition-colors ${
                  pathname === link.href
                    ? "bg-sky/20 text-skyLight"
                    : "text-mist/70 hover:text-mist"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* tombol menu mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full bg-panel px-3 py-1 text-lg md:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* menu mobile */}
      {open && (
        <ul className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-sky/10 bg-navy/90 px-4 py-3 font-body text-sm md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-full px-4 py-2 ${
                  pathname === link.href ? "bg-sky/20 text-skyLight" : "text-mist/70"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
