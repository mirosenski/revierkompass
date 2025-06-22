import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
interface ThemeCtx {
	theme: Theme;
	setTheme: (t: Theme) => void;
	toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(() => {
		// Sofort beim ersten Render das localStorage lesen
		try {
			const saved = localStorage.getItem("rk-theme") as Theme;
			console.log("Initial theme from localStorage:", saved);
			return saved || "system";
		} catch {
			console.log("No localStorage, using system");
			return "system";
		}
	});

	// Robuste Funktion zum Setzen der Theme-Klasse
	const apply = useCallback((t: Theme) => {
		console.log("Applying theme:", t);
		const root = document.documentElement;

		// Entferne alle Theme-Klassen
		root.classList.remove("light", "dark");

		// Setze die entsprechende Klasse
		if (
			t === "dark" ||
			(t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			root.classList.add("dark");
			console.log("Applied dark theme");
		} else {
			root.classList.add("light");
			console.log("Applied light theme");
		}

		// Force reflow für bessere Browser-Kompatibilität
		root.offsetHeight;
	}, []);

	const setTheme = (t: Theme) => {
		console.log("Setting theme to:", t);
		setThemeState(t);
		localStorage.setItem("rk-theme", t);
		apply(t);
	};

	const toggle = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		console.log("Toggling theme from", theme, "to", newTheme);
		setTheme(newTheme);
	};

	// Theme beim ersten Render und bei Änderung anwenden
	useEffect(() => {
		console.log("Applying theme:", theme);
		apply(theme);
	}, [theme, apply]);

	// Listener für System-Änderung im Modus "system"
	useEffect(() => {
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handler = () => {
				console.log("System theme changed, applying system theme");
				apply("system");
			};
			mediaQuery.addEventListener("change", handler);
			return () => mediaQuery.removeEventListener("change", handler);
		}
	}, [theme, apply]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
	return ctx;
};
