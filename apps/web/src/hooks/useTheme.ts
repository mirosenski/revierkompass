import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		try {
			const saved = localStorage.getItem("theme");
			if (saved === "light" || saved === "dark") {
				return saved as Theme;
			}
		} catch (error) {
			console.warn("localStorage nicht verfügbar:", error);
		}
		return "system";
	});

	const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(() => {
		if (theme !== "system") return theme;
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	});

	const applyTheme = useCallback((selectedTheme: Theme) => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");

		let actualTheme: "light" | "dark";

		if (selectedTheme === "light") {
			root.classList.add("light");
			actualTheme = "light";
		} else if (selectedTheme === "dark") {
			root.classList.add("dark");
			actualTheme = "dark";
		} else {
			// System theme
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				root.classList.add("dark");
				actualTheme = "dark";
			} else {
				root.classList.add("light");
				actualTheme = "light";
			}
		}

		setCurrentTheme(actualTheme);
	}, []);

	const changeTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		applyTheme(newTheme);

		try {
			localStorage.setItem("theme", newTheme);
		} catch (error) {
			console.warn("Konnte Theme nicht in localStorage speichern:", error);
		}
	};

	useEffect(() => {
		applyTheme(theme);
	}, [applyTheme, theme]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handler = (e: MediaQueryListEvent) => {
			if (theme === "system") {
				const root = document.documentElement;
				root.classList.remove("light", "dark");
				const newTheme = e.matches ? "dark" : "light";
				root.classList.add(newTheme);
				setCurrentTheme(newTheme);
			}
		};

		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [theme]);

	return {
		theme,
		currentTheme,
		changeTheme,
		isDark: currentTheme === "dark",
		isLight: currentTheme === "light",
		isSystem: theme === "system",
	};
}
