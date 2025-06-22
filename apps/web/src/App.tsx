import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { WizardStep1, WizardStep2, WizardStep3 } from "./components/wizard";

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
			<WizardStep1 />
		</main>
	);
}

function WizardStep2Page() {
	return (
		<main className="container mx-auto px-4 py-8">
			<WizardStep2 />
		</main>
	);
}

function ResultPage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<WizardStep3 />
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
		<>
			{/* NOScript Warning */}
			<div className="hidden noscript:block bg-red-500 text-white p-4 text-center">
				<div className="container mx-auto">
					<strong>JavaScript erforderlich:</strong> Diese Anwendung benötigt JavaScript für die
					volle Funktionalität. Bitte aktivieren Sie JavaScript in Ihrem Browser.
				</div>
			</div>

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
							<Route path="/step-2" element={<WizardStep2Page />} />
							<Route path="/result" element={<ResultPage />} />
							<Route path="/praesidien" element={<PraesidienPage />} />
							<Route path="/karte" element={<KartePage />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</Router>
		</>
	);
}
