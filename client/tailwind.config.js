// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//       "./app/**/*.{js,ts,jsx,tsx}", 
//       "./components/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//       extend: {
//         fontFamily: {
//           sans: ['var(--font-open-sans)', 'sans-serif'],
//         },
//       },
//     },
//     plugins: [],
//   };
  


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", 
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-open-sans)', 'sans-serif'],
          orbitron: ['var(--font-orbitron)', 'monospace'],
        },
      },
    },
    plugins: [],
  };