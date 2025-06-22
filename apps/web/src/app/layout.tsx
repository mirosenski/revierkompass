import { Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function Shell() {
	return (
		<ThemeProvider>
			<div className="flex min-h-dvh flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
				<Header />
				<Breadcrumbs />
				<main className="flex-1 container mx-auto px-4 py-8">
					<Outlet />
				</main>
				<Footer />
			</div>
		</ThemeProvider>
	);
}
