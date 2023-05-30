/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                orange: "#F4512B",
                blue: {
                    dark: "#132645",
                    light: "#25A2CC",
                },
                white: "#F5F5F5",
                black: "#1F1F1F",
            },
        },
    },
    plugins: [],
};
