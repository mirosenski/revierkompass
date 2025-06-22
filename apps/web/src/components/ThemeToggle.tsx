import { useTheme } from "@/providers/ThemeProvider";

interface ThemeToggleProps {
	className?: string;
	showLabels?: boolean;
}

export function ThemeToggle({ className = "", showLabels = true }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme();

	const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
		setTheme(newTheme);
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
		</div>
	);
}
