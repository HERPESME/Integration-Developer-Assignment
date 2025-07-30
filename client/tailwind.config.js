/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a",
        surface: "#2a2a2a",
        primary: "#6c5ce7",
        'primary-hover': "#5a4cdb",
        'primary-focus': "#483ac9",
        secondary: "#a0aec0",
        'text-primary': "#ffffff",
        'text-secondary': "#a0aec0",
        border: "#4a4a4a",
        error: "#e53e3e",
        success: "#48bb78",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
