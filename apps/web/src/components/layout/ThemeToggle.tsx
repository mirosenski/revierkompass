import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect, useRef } from "react";
// Falls du eine eigene Button-Komponente hast, importiere sie hier:
// import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
		setTheme(newTheme);
		setIsOpen(false);
	};

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Toggle Button */}
			<button
				type="button"
				aria-label="Theme auswählen"
				onClick={() => setIsOpen(!isOpen)}
				className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
			>
				{theme === "dark" ? (
					<Moon className="w-5 h-5" />
				) : theme === "light" ? (
					<Sun className="w-5 h-5" />
				) : (
					<Monitor className="w-5 h-5" />
				)}
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[140px]">
					<div className="py-1">
						<button
							onClick={() => handleThemeChange("light")}
							className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
								theme === "light" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
							}`}
						>
							<Sun className="w-4 h-4" />
							<span className="text-sm">Hell</span>
						</button>
						<button
							onClick={() => handleThemeChange("system")}
							className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
								theme === "system" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
							}`}
						>
							<Monitor className="w-4 h-4" />
							<span className="text-sm">System</span>
						</button>
						<button
							onClick={() => handleThemeChange("dark")}
							className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
								theme === "dark" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
							}`}
						>
							<Moon className="w-4 h-4" />
							<span className="text-sm">Dunkel</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
