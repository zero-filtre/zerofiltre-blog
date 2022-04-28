module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      fontFamily: {
        montserat: "'Montserrat', sans-serif",
        raleway: "'Raleway', sans-serif",
        ubuntu: "'Ubuntu', sans-serif"
      },
      colors: {
        primary: {
          500: "#15b2bc",
          300: "#00c2cb",
          100: "#f2feff",
        },
        secondary: "#052b5d",
        accent: {
          500: '#fdbc5a',
          400: '#ffbd59'
        },
        error: "#f55f44",
        grays: "#eef1f4",
        skin: {
          base: "#6b7280",
          text: "#374151",
          link: "#f3f4f6",
          muted: "#9ca3af",
          inverted: "#052b5d",
          border: "#e5e7eb",
          card: "#fff",
          cardMuted: "#f9fafb",
          borderBold: "#d1d5db",
          bg: "#f9fafb",
          bgMuted: "#f3f4f6"
        },
      },
      spacing: {
        px: '1px',
        btnHx: '38px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
