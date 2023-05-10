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
                "l-bg": "#F5F5F5",
                "l-border": "#DBDBDB",
                "l-txt": "#121212",
                "l-tsp": "#12121280",

                "d-bg": "#121212",
                "d-border": "#262626",
                "d-txt": "#FAFAFA",
                "d-tsp": "#FAFAFA80",

                "l-main-disabled": "hsl(206, 100%, 65%)",
                "l-main": "hsl(206, 100%, 50%)",
                "l-main-hovered": "hsl(206, 100%, 40%)",

                "d-main-disabled": "hsl(206, 80%, 69%)",
                "d-main": "hsl(206, 80%, 59%)",
                "d-main-hovered": "hsl(206, 80%, 49%)",
            },
        },
    },
    plugins: [],
};
