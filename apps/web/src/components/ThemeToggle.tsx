import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps {
	className?: string;
	showLabels?: boolean;
}

export function ThemeToggle({ className = "", showLabels = true }: ThemeToggleProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		try {
			const saved = localStorage.getItem("theme");
			// Nur verwende localStorage wenn es explizit gesetzt wurde
			if (saved && ["light", "dark"].includes(saved)) {
				return saved as Theme;
			}
			// Standard ist 'system'
			return "system";
		} catch (error) {
			console.warn("localStorage nicht verfügbar:", error);
			return "system";
		}
	});

	const applyTheme = useCallback((selectedTheme: Theme) => {
		const root = document.documentElement;
		console.log("Applying theme:", selectedTheme);

		// Entferne beide Klassen erst
		root.classList.remove("light", "dark");

		if (selectedTheme === "light") {
			root.classList.add("light");
			console.log("Added light class");
		} else if (selectedTheme === "dark") {
			root.classList.add("dark");
			console.log("Added dark class");
		} else {
			// System theme
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				root.classList.add("dark");
				console.log("Added dark class (system)");
			} else {
				root.classList.add("light");
				console.log("Added light class (system)");
			}
		}

		console.log("Final HTML classes:", root.className);

		// Force reflow für bessere Browser-Kompatibilität
		root.offsetHeight;
	}, []);

	const handleThemeChange = (newTheme: Theme) => {
		console.log("Theme change requested:", newTheme);
		setTheme(newTheme);
		applyTheme(newTheme);

		try {
			if (newTheme === "system") {
				// Entferne localStorage für System-Theme
				localStorage.removeItem("theme");
				console.log("Removed theme from localStorage (using system)");
			} else {
				// Speichere nur explizite Auswahl
				localStorage.setItem("theme", newTheme);
				console.log("Theme saved to localStorage:", newTheme);
			}
		} catch (error) {
			console.warn("Konnte Theme nicht in localStorage speichern:", error);
		}
	};

	// Initialisiere Theme beim ersten Laden
	useEffect(() => {
		console.log("Component mounted, initializing theme:", theme);
		applyTheme(theme);
	}, [applyTheme, theme]);

	// Listener für System Theme Changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handler = (e: MediaQueryListEvent) => {
			if (theme === "system") {
				console.log("System theme changed:", e.matches ? "dark" : "light");
				const root = document.documentElement;
				root.classList.remove("light", "dark");
				root.classList.add(e.matches ? "dark" : "light");

				// Force reflow
				root.offsetHeight;
			}
		};

		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [theme]);

	// Debug: Zeige aktuellen Theme-Status
	const getCurrentActiveTheme = () => {
		const root = document.documentElement;
		if (root.classList.contains("dark")) return "dark";
		if (root.classList.contains("light")) return "light";
		return "none";
	};

	const getSystemPreference = () => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dunkel" : "hell";
	};

	return (
		<div
			className={`bg-gray-200 dark:bg-gray-800 p-1 rounded-lg inline-flex gap-1 shadow-lg ${className}`}
		>
			<button
				type="button"
				onClick={() => handleThemeChange("light")}
				className={`px-4 py-2 rounded transition-all ${
					theme === "light"
						? "bg-white dark:bg-gray-600 shadow-md text-gray-900 dark:text-white"
						: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
				}`}
				title="Hell"
			>
				☀️ {showLabels && "Hell"}
			</button>
			<button
				type="button"
				onClick={() => handleThemeChange("system")}
				className={`px-4 py-2 rounded transition-all ${
					theme === "system"
						? "bg-white dark:bg-gray-600 shadow-md text-gray-900 dark:text-white"
						: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
				}`}
				title="System"
			>
				💻 {showLabels && "System"}
			</button>
			<button
				type="button"
				onClick={() => handleThemeChange("dark")}
				className={`px-4 py-2 rounded transition-all ${
					theme === "dark"
						? "bg-white dark:bg-gray-600 shadow-md text-gray-900 dark:text-white"
						: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
				}`}
				title="Dunkel"
			>
				🌙 {showLabels && "Dunkel"}
			</button>

			{/* Debug Info */}
			<div className="ml-4 text-xs text-gray-500 dark:text-gray-400">
				<div>Gewählt: {theme}</div>
				<div>Aktiv: {getCurrentActiveTheme()}</div>
				{theme === "system" && <div>System: {getSystemPreference()}</div>}
			</div>
		</div>
	);
}
