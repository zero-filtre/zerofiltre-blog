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
          50: '#00c2cb',
          100: "#A0DAE1",
          200: "#73CCD6",
          300: "#4AC3CD",
          400: "#1FBEC8",
          500: "#15B2BC",
          600: "#0FA6AF",
          700: "#09969F",
          800: "#057C86",
          900: '#04666C'
        },
        secondary: "#052b5d",
        accent: {
          100: '#FFE5BD',
          200: '#FFD79C',
          300: '#FECA7A',
          400: '#fdbc5a',
          500: '#ECAA47',
          600: '#D99833',
          700: '#C58624',
          800: '#B07518',
          900: '#9E650C'
        },
        error: "#f55f44",
        grays: {
          100: "#eef1f4",
          200: '#F9FAFB',
          600: "#4B5563"
        },
        skin: {
          base: "#6b7280",
          text: "#374151",
          art: "#052b5d",
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
    require('@tailwindcss/aspect-ratio'),
  ],
}
