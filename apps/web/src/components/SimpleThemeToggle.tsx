import { useTheme } from "@/hooks/useTheme";

export function SimpleThemeToggle() {
	const { currentTheme, changeTheme, isDark } = useTheme();

	const toggleTheme = () => {
		changeTheme(isDark ? "light" : "dark");
	};

	return (
		<div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
			<button
				type="button"
				onClick={toggleTheme}
				className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium pointer-coarse:px-8 pointer-coarse:py-4 pointer-coarse:text-lg"
			>
				{isDark ? "☀️ Zu Hell wechseln" : "🌙 Zu Dunkel wechseln"}
			</button>
			<div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
				Aktueller Modus: <strong>{isDark ? "Dunkel" : "Hell"}</strong>
			</div>
			<div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
				Theme: {currentTheme} | HTML Classes: {document.documentElement.className || "keine"}
			</div>
		</div>
	);
}
