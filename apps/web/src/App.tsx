import { ThemeToggle } from "./components/ThemeToggle";
import { SimpleThemeToggle } from "./components/SimpleThemeToggle";

export default function App() {
	const getCurrentTheme = () => {
		const root = document.documentElement;
		if (root.classList.contains("dark")) return "dark";
		if (root.classList.contains("light")) return "light";
		return "none";
	};

	const getSystemPreference = () => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dunkel" : "hell";
	};

	const setThemeManually = (theme: "light" | "dark") => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
		console.log("Theme manuell gesetzt auf:", theme);
		console.log("HTML classes:", root.className);
	};

	const forceSystemTheme = () => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");

		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			root.classList.add("dark");
			console.log("System: Dunkel erkannt, dark Klasse hinzugefügt");
		} else {
			root.classList.add("light");
			console.log("System: Hell erkannt, light Klasse hinzugefügt");
		}

		console.log("HTML classes:", root.className);
	};

	const resetToSystem = () => {
		localStorage.removeItem("theme");
		console.log("localStorage gelöscht, lade Seite neu...");
		window.location.reload();
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
					RevierKompass - Dark Mode Test ✅
				</h1>

				<div className="flex justify-center gap-4 mb-8">
					<button
						type="button"
						onClick={() => setThemeManually("light")}
						className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
					>
						☀️ Manuell Hell
					</button>
					<button
						type="button"
						onClick={() => setThemeManually("dark")}
						className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
					>
						🌙 Manuell Dunkel
					</button>
					<button
						type="button"
						onClick={forceSystemTheme}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						🔄 System erzwingen
					</button>
					<button
						type="button"
						onClick={resetToSystem}
						className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						🔄 Zurücksetzen
					</button>
				</div>

				<div className="space-y-8 mb-8">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
							Vollständige ThemeToggle (Hell, System, Dunkel)
						</h3>
						<div className="flex justify-center">
							<ThemeToggle />
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
							Einfache ThemeToggle (Hell ↔ Dunkel)
						</h3>
						<div className="flex justify-center">
							<SimpleThemeToggle />
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Debug Information
					</h3>
					<div className="space-y-2 text-sm">
						<p className="text-gray-700 dark:text-gray-300">
							<strong>HTML Classes:</strong> {document.documentElement.className || "keine"}
						</p>
						<p className="text-gray-700 dark:text-gray-300">
							<strong>Aktives Theme:</strong> {getCurrentTheme()}
						</p>
						<p className="text-gray-700 dark:text-gray-300">
							<strong>System Präferenz:</strong> {getSystemPreference()}
						</p>
						<p className="text-gray-700 dark:text-gray-300">
							<strong>localStorage Theme:</strong>{" "}
							{localStorage.getItem("theme") || "nicht gesetzt"}
						</p>
						<p className="text-gray-700 dark:text-gray-300">
							<strong>prefers-color-scheme:</strong>{" "}
							{window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"}
						</p>
						<p className="text-gray-700 dark:text-gray-300">
							<strong>color-scheme:</strong>{" "}
							{getComputedStyle(document.documentElement).colorScheme}
						</p>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Test Card 1</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Diese Karte sollte in allen Modi korrekt dargestellt werden.
						</p>
					</div>
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Test Card 2</h3>
						<p className="text-gray-600 dark:text-gray-400">
							Der Text sollte in allen Modi gut lesbar sein.
						</p>
					</div>
				</div>

				{/* Design-Tokens Test */}
				<div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Design-Tokens Test
					</h3>
					<div className="space-y-4">
						<button
							type="button"
							className="bg-primary-500 hover:bg-primary-700 text-gray-50 px-4 py-2 rounded-lg shadow-sm transition-colors"
						>
							Tokens live! 🎨
						</button>
						<div className="flex gap-4">
							<div className="w-16 h-16 bg-primary-50 rounded border"></div>
							<div className="w-16 h-16 bg-primary-100 rounded border"></div>
							<div className="w-16 h-16 bg-primary-500 rounded border"></div>
							<div className="w-16 h-16 bg-primary-700 rounded border"></div>
						</div>
						<div className="flex gap-4">
							<div className="w-16 h-16 bg-gray-50 rounded border"></div>
							<div className="w-16 h-16 bg-gray-900 rounded border"></div>
						</div>
						<div className="flex gap-4">
							<div className="w-16 h-16 bg-gray-50 rounded-sm shadow-xs border"></div>
							<div className="w-16 h-16 bg-gray-50 rounded shadow-sm border"></div>
							<div className="w-16 h-16 bg-gray-50 rounded-lg shadow-sm border"></div>
						</div>
					</div>
				</div>

				<div className="mt-8 bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
					<h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
						System-Modus Test
					</h3>
					<p className="text-blue-700 dark:text-blue-300">
						Wenn du "System" auswählst, sollte das Theme automatisch deiner OS-Einstellung folgen.
						Ändere deine System-Einstellung (Hell/Dunkel) und das Theme sollte sich automatisch
						anpassen. Klicke "System erzwingen" um das System-Theme manuell zu aktivieren. Klicke
						"Zurücksetzen" um localStorage zu löschen und die Seite neu zu laden.
					</p>
				</div>

				<div className="mt-8 text-center">
					<p className="text-gray-700 dark:text-gray-300">
						Das System-Theme sollte jetzt automatisch beim Laden erkannt werden! 🎉
					</p>
				</div>
			</div>
		</div>
	);
}
