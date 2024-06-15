/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./node_modules/flowbite/**/*.js",
     "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: { 
      colors: {
      "twitter-blue": "#1DA1F2"
      },
    },
  },
  plugins: [ require('flowbite/plugin')],
};

