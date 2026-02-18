/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        aeonik: ["Aeonik", "system-ui", "sans-serif"],
        sans: ["Aeonik", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
