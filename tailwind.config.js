/ @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["\"Zen Kaku Gothic New\"", "system-ui", "sans-serif"],
                display: ["\"Shippori Mincho\"", "Georgia", "serif"]
            },
            colors: {
                ink: "#3A2A24",
                slateSoft: "#5A6574",
                mist: "#FBF6F1",
                line: "#DDD6CB",
                accent: "#D9772F",
                accentDeep: "#B45309",
                sky: "#3D6B9A"
            },
            boxShadow: {
                soft: "0 12px 36px rgba(11, 28, 51, 0.10)",
                window: "0 28px 70px rgba(11, 28, 51, 0.34)",
                glow: "0 0 40px rgba(217, 119, 47, 0.22)"
            },
            spacing: {
                topbar: "3rem"
            },
            borderRadius: {
                window: "1.35rem"
            }
        }
    },
    plugins: []
};
