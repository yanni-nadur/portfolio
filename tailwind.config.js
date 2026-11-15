/** @type {import('tailwindcss').Config} */
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
                surface: "#FFFDF8",
                line: "#DDD6CB",
                accent: "#D9772F",
                accentDeep: "#B45309",
                night: "#000000",
                sky: "#3D6B9A",
                sakura: "#F2A7B8",
                washi: "#FBF6F1"
            },
            maxWidth: {
                content: "72rem",
                wide: "80rem"
            },
            boxShadow: {
                soft: "0 12px 36px rgba(11, 28, 51, 0.10)",
                window: "0 28px 70px rgba(11, 28, 51, 0.34)",
                glow: "0 0 40px rgba(217, 119, 47, 0.22)"
            },
            spacing: {
                dock: "5.5rem",
                topbar: "2.75rem"
            },
            borderRadius: {
                window: "1.35rem"
            }
        }
    },
    plugins: []
};
