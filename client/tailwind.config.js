/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Aquí se le indica a Tailwind que busque en tus archivos JS, JSX, TS, TSX dentro de la carpeta src
    "./public/index.html",        // También puedes especificar archivos HTML si es necesario
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
