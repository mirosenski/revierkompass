import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
// Falls du eine eigene Button-Komponente hast, importiere sie hier:
// import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const handleClick = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
	};

	return (
		<button
			type="button"
			aria-label="Toggle Dark Mode"
			onClick={handleClick}
			className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
		>
			{theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
		</button>
	);
}
