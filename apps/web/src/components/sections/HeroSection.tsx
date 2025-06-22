import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MapPin, Search, Shield, Zap } from "lucide-react";

export function HeroSection() {
	const handleRoutePlanning = () => {
		window.location.href = "/wizard";
	};

	const handleAllPresidencies = () => {
		window.location.href = "/praesidien";
	};

	return (
		<section className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20" />

			{/* Grid pattern overlay */}
			<div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

			<div className="relative container mx-auto max-w-7xl">
				{/* Main Hero Content */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
						<Zap className="h-4 w-4" />
						Schnellste Routen zu allen Revieren
					</div>

					<h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 text-shadow-lg text-shadow-black/20 dark:text-shadow-white/10">
						Willkommen beim
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-shadow-lg text-shadow-blue-500/30 dark:text-shadow-blue-400/20">
							RevierKompass
						</span>
					</h1>

					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 text-shadow-sm text-shadow-black/10 dark:text-shadow-white/5">
						Finden Sie in Sekundenschnelle die optimale Route zum nächsten Polizeipräsidium.
						Intelligent, offline-fähig und immer aktuell.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all pointer-coarse:px-12 pointer-coarse:py-8 pointer-coarse:text-xl text-shadow-sm text-shadow-black/20"
							onClick={handleRoutePlanning}
						>
							<Search className="mr-2 h-5 w-5 pointer-coarse:h-6 pointer-coarse:w-6" />
							Route planen
							<ArrowRight className="ml-2 h-5 w-5 pointer-coarse:h-6 pointer-coarse:w-6" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="px-8 py-6 text-lg pointer-coarse:px-12 pointer-coarse:py-8 pointer-coarse:text-xl text-shadow-sm text-shadow-black/10"
							onClick={handleAllPresidencies}
						>
							<MapPin className="mr-2 h-5 w-5 pointer-coarse:h-6 pointer-coarse:w-6" />
							Alle Präsidien
						</Button>
					</div>
				</div>

				{/* Feature Cards - Bento Grid Style */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
					{/* Main Feature - Spans 2 columns */}
					<Card className="md:col-span-2 p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 hover:scale-105 transition-transform duration-300">
						<Search className="h-12 w-12 mb-4 opacity-90" />
						<h3 className="text-2xl font-bold mb-3">Intelligente Routenplanung</h3>
						<p className="text-blue-100 text-lg">
							Optimale Streckenführung mit Echtzeitdaten und alternativen Routen bei Sperrungen.
						</p>
					</Card>

					{/* Security Feature */}
					<Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 inverted-colors:shadow-none">
						<div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-green-500/30 inverted-colors:drop-shadow-none">
							<Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2">Sicher & Verschlüsselt</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Alle Daten verschlüsselt und DSGVO-konform.
						</p>
					</Card>

					{/* Speed Feature */}
					<Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 inverted-colors:shadow-none">
						<div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-orange-500/30 inverted-colors:drop-shadow-none">
							<Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2">Blitzschnell</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Routenberechnung in unter 100ms dank WASM.
						</p>
					</Card>

					{/* Stats Row */}
					<Card className="lg:col-span-2 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
						<div className="flex flex-col sm:flex-row items-baseline-last justify-between gap-4">
							<div className="text-center sm:text-left">
								<p className="text-3xl font-bold text-gray-900 dark:text-white">1.337</p>
								<p className="text-gray-600 dark:text-gray-400">Polizeireviere</p>
							</div>
							<div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-600" />
							<div className="text-center sm:text-left">
								<p className="text-3xl font-bold text-gray-900 dark:text-white">24/7</p>
								<p className="text-gray-600 dark:text-gray-400">Verfügbarkeit</p>
							</div>
							<div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-600" />
							<div className="text-center sm:text-left">
								<p className="text-3xl font-bold text-gray-900 dark:text-white">&lt;100ms</p>
								<p className="text-gray-600 dark:text-gray-400">Antwortzeit</p>
							</div>
						</div>
					</Card>

					{/* Offline Feature */}
					<Card className="lg:col-span-2 p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:scale-105 transition-transform duration-300">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-xl font-bold mb-2">100% Offline-fähig</h3>
								<p className="text-purple-100">
									Funktioniert auch ohne Internet dank Progressive Web App Technologie.
								</p>
							</div>
							<MapPin className="h-16 w-16 opacity-20" />
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}
