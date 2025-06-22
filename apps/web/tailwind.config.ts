import type { Config } from "tailwindcss";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class", // Wichtig: Dies aktiviert class-basiertes Dark Mode
	theme: {
		extend: {
			colors: {
				primary: {
					50: "hsl(var(--rk-primary-50) / <alpha-value>)",
					100: "hsl(var(--rk-primary-100) / <alpha-value>)",
					500: "hsl(var(--rk-primary-500) / <alpha-value>)",
					700: "hsl(var(--rk-primary-700) / <alpha-value>)",
				},
				gray: {
					50: "hsl(var(--rk-gray-50) / <alpha-value>)",
					900: "hsl(var(--rk-gray-900) / <alpha-value>)",
				},
			},
			borderRadius: {
				sm: "var(--rk-radius-sm)",
				DEFAULT: "var(--rk-radius-md)",
				lg: "var(--rk-radius-lg)",
			},
			boxShadow: {
				xs: "var(--rk-shadow-xs)",
				sm: "var(--rk-shadow-sm)",
			},
		},
	},
	plugins: [],
} satisfies Config;
