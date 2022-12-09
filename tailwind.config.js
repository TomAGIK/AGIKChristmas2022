/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/views/*.blade.php",
  ],
  theme: {
    extend: {
        fontFamily: {
            score: ["Score", "sans-serif"]
        },
    },
  },
  plugins: [],
}
