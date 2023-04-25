/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                grandista: ["Grandista"],
            },
            colors: {
                "button-disabled": "#4db4f9",
                button: "#0093f5",
                "button-hovered": "#1876f2",
            },
        },
    },
    plugins: [],
};
