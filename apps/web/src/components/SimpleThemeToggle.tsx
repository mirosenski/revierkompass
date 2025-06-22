import { useState, useEffect } from "react";

export function SimpleThemeToggle() {
	const [isDark, setIsDark] = useState(() => {
		// Prüfe zuerst localStorage
		try {
			const savedTheme = localStorage.getItem("theme");
			if (savedTheme === "dark") return true;
			if (savedTheme === "light") return false;
			// Wenn "system" oder nichts gespeichert ist, verwende System-Theme
		} catch (error) {
			console.warn("localStorage nicht verfügbar:", error);
		}

		// Fallback zu System-Theme
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	const toggleTheme = () => {
		const root = document.documentElement;
		const newIsDark = !isDark;

		// Entferne beide Klassen
		root.classList.remove("light", "dark");

		// Füge die neue Klasse hinzu
		if (newIsDark) {
			root.classList.add("dark");
		} else {
			root.classList.add("light");
		}

		setIsDark(newIsDark);

		// Speichere in localStorage
		try {
			localStorage.setItem("theme", newIsDark ? "dark" : "light");
			console.log("Theme saved to localStorage:", newIsDark ? "dark" : "light");
		} catch (error) {
			console.warn("localStorage Fehler:", error);
		}

		console.log("Theme toggled to:", newIsDark ? "dark" : "light");
		console.log("HTML classes:", root.className);
	};

	// Initialisiere beim Laden
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark" || savedTheme === "light") {
			const root = document.documentElement;
			root.classList.remove("light", "dark");
			root.classList.add(savedTheme);
			setIsDark(savedTheme === "dark");
			console.log("Initialized from localStorage:", savedTheme);
		} else {
			// Verwende aktuelles System-Theme
			const currentIsDark = document.documentElement.classList.contains("dark");
			setIsDark(currentIsDark);
			console.log("Using system theme:", currentIsDark ? "dark" : "light");
		}
	}, []);

	return (
		<div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
			<button
				type="button"
				onClick={toggleTheme}
				className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
			>
				{isDark ? "☀️ Zu Hell wechseln" : "🌙 Zu Dunkel wechseln"}
			</button>
			<div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
				Aktueller Modus: <strong>{isDark ? "Dunkel" : "Hell"}</strong>
			</div>
			<div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
				HTML Classes: {document.documentElement.className || "keine"}
			</div>
		</div>
	);
}
