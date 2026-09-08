/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-soft': 'var(--color-primary-soft)',

          secondary: 'var(--color-secondary)',
          'secondary-hover': 'var(--color-secondary-hover)',
          'secondary-soft': 'var(--color-secondary-soft)',

          bg: 'var(--color-bg-main)',
          card: 'var(--color-bg-card)',
          border: 'var(--color-border)',
          title: 'var(--color-text-title)',
          body: 'var(--color-text-body)',
        }
      }
    },
  },
  plugins: [],
}