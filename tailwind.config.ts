
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // Define custom classes for different screen sizes
      screens: {
        sm: "640px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra large screens
      },

      width: {
        custom: "300px", // Define a custom width value
      },
      height: {
        height: "460px",
      },
      colors: {
        "custom-blue": "#A6CE39", // Define a custom color
        "custom-color": "#454544", // Define a custom color
        custom: "#e5e5e5", // Define a custom color
      },
      // Extend background image utilities
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
     require('@tailwindcss/typography'),
    //  function ({ addUtilities }) {
    //   const newUtilities = {
    //     '.clip-custom': {
    //       'clip-path': 'polygon(50% 0%, 100% 0, 100% 35%, 100% 70%, 100% 100%, 25% 100%, 25% 64%, 0 53%, 50% 43%, 25% 0)',
    //     },
    //   };
    //   addUtilities(newUtilities);
    // },
  ],
};
