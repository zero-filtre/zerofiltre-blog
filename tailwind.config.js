module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        montserat: "'Montserrat', sans-serif",
        raleway: "'Raleway', sans-serif",
        ubuntu: "'Ubuntu', sans-serif",
        sohne: "'Leicht', sans-serif",
        sohneK: "'Kraftig', sans-serif"
      },
      colors: {
        primary: {
          50: "rgba(var(--primary-50))",
          100: "rgba(var(--primary-100))",
          200: "rgba(var(--primary-200))",
          300: "rgba(var(--primary-300))",
          400: "rgba(var(--primary-400))",
          500: "rgba(var(--primary-500))",
          600: "rgba(var(--primary-600))",
          700: "rgba(var(--primary-700))",
          800: "rgba(var(--primary-800))",
          900: "rgba(var(--primary-900))"
        },
        secondary: "rgba(var(--secondary))",
        accent: {
          100: "rgba(var(--accent-100))",
          200: "rgba(var(--accent-200))",
          300: "rgba(var(--accent-300))",
          400: "rgba(var(--accent-400))",
          500: "rgba(var(--accent-500))",
          600: "rgba(var(--accent-600))",
          700: "rgba(var(--accent-700))",
          800: "rgba(var(--accent-800))",
          900: "rgba(var(--accent-900))"
        },
        error: "rgba(var(--error))",
        grays: {
          100: "rgba(var(--grays-100))",
          200: "rgba(var(--grays-200))",
          600: "rgba(var(--grays-600))"
        },
        skin: {
          base: "rgba(var(--skin-base))",
          white: "rgba(var(--skin-white))",
          text: "rgba(var(--skin-text))",
          art: "rgba(var(--skin-art))",
          link: "rgba(var(--skin-link))",
          muted: "rgba(var(--skin-muted))",
          inverted: "rgba(var(--skin-inverted))",
          border: "rgba(var(--skin-border))",
          card: "rgba(var(--skin-card))",
          cardMuted: "rgba(var(--skin-cardMuted))",
          borderBold: "rgba(var(--skin-borderBold))",
          bg: "rgba(var(--skin-bg))",
          bgSecondary: "rgba(var(--skin-bg-secondary))",
          bgMuted: "rgba(var(--skin-bgMuted))"
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
