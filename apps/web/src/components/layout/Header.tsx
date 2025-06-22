export function Header() {
	return (
		<header className="bg-primary-500 text-gray-50 shadow-sm">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<span className="font-semibold tracking-wide">RevierKompass Next</span>

				{/* Platzhalter Navigation */}
				<nav className="space-x-4 text-sm">
					<a href="/" className="hover:underline">
						Home
					</a>
					<a href="/about" className="hover:underline">
						About
					</a>
				</nav>
			</div>
		</header>
	);
}
