/** @type {import('tailwindcss').Config} */
// colors that change between light/dark are CSS variables (see index.css)
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
      colors: {
        surface: v("surface"),
        card: v("card"),
        primary: {
          DEFAULT: "#5F6FFF",
          50: v("p50"),
          100: v("p100"),
          200: "#CBD1FF",
          300: "#A9B2FF",
          400: "#8591FF",
          500: "#5F6FFF",
          600: "#4A57E8",
          700: "#3B45C2",
          900: "#232A73",
        },
        ink: { DEFAULT: v("ink"), soft: v("ink-soft"), muted: v("ink-muted") },
        slate: {
          50: v("s50"),
          100: v("s100"),
          200: v("s200"),
          300: v("s300"),
          400: v("s400"),
          500: v("s500"),
          600: v("s600"),
          700: v("s700"),
          800: v("s800"),
          900: v("s900"),
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px -8px rgba(15,23,42,.10)",
        lift: "0 2px 4px rgba(15,23,42,.05), 0 20px 40px -12px rgba(95,111,255,.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s ease-out backwards", // backwards (not both): no leftover transform afterwards
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
