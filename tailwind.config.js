const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

module.exports = {
  prefix: "",
  mode: "jit",
  purge: {
    content: ["./src/**/*.{html,ts,css,scss,sass,less,styl}"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        montserat: "'Montserrat', sans-serif",
      },
      colors: {
        primary: {
          500: "#15b2bc",
          300: "#00c2cb",
          100: "#f2feff",
        },
        secondary: "#052b5d",
        accent: "#fdbc5a",
        error: "#f55f44",
        grays: "#eef1f4",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
