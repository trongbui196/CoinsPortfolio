export default {
  content: [
    './index.html',
    "./Pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0B0B0F',
          secondary: '#141416',
        }
      }
    },
  },
  plugins: [],
};
