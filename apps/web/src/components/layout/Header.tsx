import { ThemeToggle } from "./ThemeToggle";

export function Header() {
	return (
		<header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border-b border-gray-200 dark:border-gray-700">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<span className="font-semibold tracking-wide">RevierKompass Next</span>

				<div className="flex items-center space-x-4">
					{/* Platzhalter Navigation */}
					<nav className="space-x-4 text-sm">
						<a
							href="/"
							className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
						>
							Home
						</a>
						<a
							href="/about"
							className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
						>
							About
						</a>
					</nav>

					{/* Theme Toggle */}
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
