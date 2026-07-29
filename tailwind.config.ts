import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#060912",     // background paling gelap (dasar halaman)
        panel: "#0F1C33",    // warna kartu/panel semi gelap
        panelLight: "#16253F", // varian panel sedikit lebih terang (hover/active)
        sky: "#38BDF8",       // warna aksen utama (biru muda)
        skyLight: "#BAE6FD",  // biru muda terang, dipakai untuk gradient teks
        mist: "#EAF4FF",      // warna teks terang di atas background gelap
      },
      fontFamily: {
        display: ["var(--font-display)"], // font bulat & tebal untuk judul besar
        body: ["var(--font-body)"],        // font untuk paragraf/navbar
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 15% 20%, rgba(56,189,248,0.25), transparent 45%), radial-gradient(circle at 85% 0%, rgba(56,189,248,0.15), transparent 40%), #060912",
      },
    },
  },
  plugins: [],
};
export default config;
