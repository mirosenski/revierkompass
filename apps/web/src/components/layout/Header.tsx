import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
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
					<div className="flex items-center gap-8">
						<a href="/" className="flex items-center gap-2 font-bold text-lg">
							<img src="/logo.svg" alt="RevierKompass Logo" className="h-8 w-auto" />
							<span className="hidden sm:inline">RevierKompass</span>
						</a>

						{/* Desktop Navigation */}
						<NavigationMenu className="hidden lg:flex">
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger>Schnellstart</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
											<li className="row-span-3">
												<NavigationMenuLink asChild>
													<a
														className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/10 to-blue-600/10 p-6 no-underline outline-none focus:shadow-md"
														href="/wizard"
													>
														<Search className="h-6 w-6 mb-2" />
														<div className="mb-2 text-lg font-medium">Route finden</div>
														<p className="text-sm leading-tight text-gray-600 dark:text-gray-400">
															Schnellste Route zum nächsten Revier berechnen
														</p>
													</a>
												</NavigationMenuLink>
											</li>
											<ListItem href="/praesidien" title="Präsidien">
												Alle Polizeipräsidien im Überblick
											</ListItem>
											<ListItem href="/karte" title="Kartenansicht">
												Interaktive Karte mit allen Standorten
											</ListItem>
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<ThemeToggle />

						<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
							<Search className="h-4 w-4" />
							<span>Neue Route</span>
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
								className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
							>
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
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}

const ListItem = ({
	className,
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"a">) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					href={href}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
};
