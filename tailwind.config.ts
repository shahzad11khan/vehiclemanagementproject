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
      // Font Family(ali).
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],  // Default sans-serif font
        montserrat: ['Montserrat', 'sans-serif'],  // Add Montserrat font
        poppins:['Poppins','sans-serif'] // Add Poppins
      },
      dropShadow: {
        custom: '0 5.08px 5.08px #00000040', // Custom drop shadow
        custom2: '0 1px 4px #00000040', // Custom2 drop shadow
        custom3: '0 4px 4px #0000001A', // Custom3 for the dasheboard cards
        custom4:"0 4px 4px #00000040" // profile updation form

      },
      // Define custom classes for different screen sizes
      screens: {
        sm: "640px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra large screens
      },
      borderRadius: {
        '4': '4px', // Add your custom border radius here
      },

      width: {
        custom: "300px", // Define a custom width value
      },
      height: {
        height: "460px",
      },
      colors: {
        "button-bg":"#313342", // for buttons
        "custom-blue": "", // Define a custom color
        "custom-color": "#454544", // Define a custom color
        "custom-bg": "#27273A", // Define a custom color 222434
        "drop-custom-bg":"#313342",  //For the header dropdown
        "modal-bg":"#D9D9D999",
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
