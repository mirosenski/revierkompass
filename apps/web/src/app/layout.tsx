import { Outlet } from "@tanstack/router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Shell() {
	return (
		<div className="flex min-h-dvh flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
			<Header />
			<main className="flex-1 container mx-auto px-4 py-8">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
