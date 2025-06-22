import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";

function HomePage() {
	return (
		<main>
			<HeroSection />
		</main>
	);
}

function AboutPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-6">Über RevierKompass</h1>
			<p className="text-lg text-gray-600 dark:text-gray-300">
				RevierKompass ist die intelligente Lösung für die Routenplanung zu Polizeipräsidien.
			</p>
		</main>
	);
}

function WizardPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-6">Route finden</h1>
			<p className="text-lg text-gray-600 dark:text-gray-300">
				Hier können Sie Ihre optimale Route planen.
			</p>
		</main>
	);
}

function PraesidienPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-6">Alle Präsidien</h1>
			<p className="text-lg text-gray-600 dark:text-gray-300">Übersicht aller Polizeipräsidien.</p>
		</main>
	);
}

function KartePage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-6">Kartenansicht</h1>
			<p className="text-lg text-gray-600 dark:text-gray-300">
				Interaktive Karte mit allen Standorten.
			</p>
		</main>
	);
}

export default function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
				<Header />
				<div className="pt-16">
					{" "}
					{/* Spacer für fixed header */}
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/wizard" element={<WizardPage />} />
						<Route path="/praesidien" element={<PraesidienPage />} />
						<Route path="/karte" element={<KartePage />} />
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	);
}
