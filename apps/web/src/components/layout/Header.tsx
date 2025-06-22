import { Button } from "@/components/ui/button";
import { Menu, Search, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
	HoverNavigationMenu,
	NavigationMenuTrigger,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/20 dark:border-gray-800/20">
			{/* Backdrop blur for glassmorphism effect */}
			<div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl" />

			<nav className="relative container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo & Brand */}
					<div className="flex items-center">
						<a href="/" className="flex items-center gap-3 font-bold text-lg">
							<img src="/logo.svg" alt="RevierKompass Logo" className="h-8 w-auto" />
							<span className="hidden sm:inline">RevierKompass</span>
						</a>
					</div>

					{/* Center spacer */}
					<div className="flex-1" />

					{/* Right side: Navigation + Actions */}
					<div className="flex items-center gap-3">
						{/* Desktop Navigation - Hover Dropdown */}
						<div className="hidden lg:block">
							<HoverNavigationMenu
								trigger={<NavigationMenuTrigger>Schnellstart</NavigationMenuTrigger>}
							>
								<div className="w-[500px] p-4">
									<div className="grid grid-cols-2 gap-3">
										{/* Hauptaktion */}
										<div className="col-span-2">
											<NavigationMenuLink
												href="/wizard"
												className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/10 to-blue-600/10 p-6 no-underline outline-none focus:shadow-md hover:scale-105 transition-transform"
											>
												<Search className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
												<div className="mb-2 text-lg font-medium">Route finden</div>
												<p className="text-sm leading-tight text-gray-600 dark:text-gray-400">
													Schnellste Route zum nächsten Revier berechnen
												</p>
											</NavigationMenuLink>
										</div>

										{/* Sekundäre Aktionen */}
										<NavigationMenuLink
											href="/praesidien"
											className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus:bg-gray-700 dark:focus:text-gray-50 hover:scale-105"
										>
											<div className="text-sm font-medium leading-none">Präsidien</div>
											<p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
												Alle Polizeipräsidien im Überblick
											</p>
										</NavigationMenuLink>

										<NavigationMenuLink
											href="/karte"
											className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus:bg-gray-700 dark:focus:text-gray-50 hover:scale-105"
										>
											<div className="text-sm font-medium leading-none">Kartenansicht</div>
											<p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
												Interaktive Karte mit allen Standorten
											</p>
										</NavigationMenuLink>
									</div>
								</div>
							</HoverNavigationMenu>
						</div>

						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Admin Login - Prominenter */}
						<Button
							variant="outline"
							size="sm"
							className="hidden sm:flex items-center gap-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
							title="Admin Login"
						>
							<Shield className="h-4 w-4" />
							<span className="hidden md:inline">Admin</span>
						</Button>

						{/* Mobile Menu Toggle */}
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							<Menu className="h-5 w-5" />
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="lg:hidden py-4 border-t border-gray-200/20 dark:border-gray-800/20">
						<div className="flex flex-col gap-2">
							<a
								href="/wizard"
								className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
							>
								<Search className="h-4 w-4" />
								Route finden
							</a>
							<a
								href="/praesidien"
								className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
							>
								Präsidien
							</a>
							<a
								href="/karte"
								className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
							>
								Karte
							</a>
							<hr className="my-2 border-gray-200 dark:border-gray-800" />
							<a
								href="/admin"
								className="px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-950 rounded-md flex items-center gap-2 text-blue-600 dark:text-blue-400"
							>
								<Shield className="h-4 w-4" />
								Admin Login
							</a>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
