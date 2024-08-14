function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        // montserat: "'Montserrat', sans-serif",
        // raleway: "'Raleway', sans-serif",
        ubuntu: "'Ubuntu', sans-serif",
        // sohne: "'Leicht', sans-serif",
        // sohneK: "'Kraftig', sans-serif"

        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],

        inter: "'Inter', 'system-ui', sans-serif"
      },
      textColor: {
        skin: {
          base: withOpacity('--color-text-base'),
          muted: withOpacity('--color-text-muted'),
          inverted: withOpacity('--color-text-inverted'),
        },
      },
      backgroundColor: {
        skin: {
          'fill-primary': withOpacity('--color-fill-primary'),
          'fill-secondary': withOpacity('--color-fill-secondary'),
          'fill-danger': withOpacity('--color-fill-danger'),
          'fill-warning': withOpacity('--color-fill-warning'),
          'button-accent': withOpacity('--color-button-accent'),
          'button-accent-hover': withOpacity('--color-button-accent-hover'),
          'button-muted': withOpacity('--color-button-muted'),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity('--color-fill-primary'),
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
