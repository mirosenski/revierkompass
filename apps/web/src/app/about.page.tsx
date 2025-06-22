import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Zap, Users, Globe, Lock, Award, Heart } from "lucide-react";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
			<div className="container mx-auto px-4 py-12">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
						<Heart className="h-4 w-4" />
						Über RevierKompass
					</div>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 text-shadow-lg text-shadow-black/20 dark:text-shadow-white/10">
						Die Zukunft der
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-shadow-lg text-shadow-blue-500/30 dark:text-shadow-blue-400/20">
							Routenplanung
						</span>
					</h1>

					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 text-shadow-sm text-shadow-black/10 dark:text-shadow-white/5">
						RevierKompass revolutioniert die Art, wie Sie zu Polizeirevieren navigieren. Mit
						modernster Technologie und einem Fokus auf Benutzerfreundlichkeit.
					</p>
				</div>

				{/* Mission Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-baseline-last mb-16">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-shadow-md text-shadow-black/15">
							Unsere Mission
						</h2>
						<p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-shadow-sm text-shadow-black/5">
							Wir machen es einfacher, schneller und sicherer, das richtige Polizeirevier zu finden.
							Mit über 1.337 Revieren in Deutschland bieten wir die umfassendste Datenbank ihrer
							Art.
						</p>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
								<span className="text-gray-700 dark:text-gray-300">Echtzeit-Routenberechnung</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="text-gray-700 dark:text-gray-300">100% Offline-fähig</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
								<span className="text-gray-700 dark:text-gray-300">DSGVO-konform & sicher</span>
							</div>
						</div>
					</div>

					<div className="relative">
						<div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
							<div className="mask-radial-from-transparent mask-radial-to-black mask-radial-at-center opacity-10 absolute inset-0"></div>
							<div className="relative z-10">
								<h3 className="text-2xl font-bold mb-4 text-shadow-lg text-shadow-black/30">
									Technologie-Stack
								</h3>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<Zap className="h-5 w-5" />
										<span>WebAssembly (WASM)</span>
									</div>
									<div className="flex items-center gap-3">
										<Globe className="h-5 w-5" />
										<span>Progressive Web App</span>
									</div>
									<div className="flex items-center gap-3">
										<Lock className="h-5 w-5" />
										<span>End-to-End Verschlüsselung</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
					<Card className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 inverted-colors:shadow-none">
						<div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-blue-500/30 inverted-colors:drop-shadow-none">
							<Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2 text-shadow-sm text-shadow-black/10">
							Blitzschnell
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Routenberechnung in unter 100ms dank WebAssembly-Technologie.
						</p>
					</Card>

					<Card className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 inverted-colors:shadow-none">
						<div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-green-500/30 inverted-colors:drop-shadow-none">
							<Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2 text-shadow-sm text-shadow-black/10">
							Sicher & Privat
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Alle Daten werden lokal verarbeitet und niemals an Dritte weitergegeben.
						</p>
					</Card>

					<Card className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 inverted-colors:shadow-none">
						<div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-purple-500/30 inverted-colors:drop-shadow-none">
							<MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2 text-shadow-sm text-shadow-black/10">
							Offline-fähig
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Funktioniert auch ohne Internetverbindung als Progressive Web App.
						</p>
					</Card>

					<Card className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 inverted-colors:shadow-none">
						<div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-orange-500/30 inverted-colors:drop-shadow-none">
							<Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2 text-shadow-sm text-shadow-black/10">
							Benutzerfreundlich
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Intuitive Bedienung für alle Altersgruppen und Technologie-Level.
						</p>
					</Card>

					<Card className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 inverted-colors:shadow-none">
						<div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-red-500/30 inverted-colors:drop-shadow-none">
							<Award className="h-8 w-8 text-red-600 dark:text-red-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2 text-shadow-sm text-shadow-black/10">
							Aktuell & Zuverlässig
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Tägliche Updates der Revierdaten für maximale Genauigkeit.
						</p>
					</Card>

					<Card className="p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 inverted-colors:shadow-none">
						<div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-3 inline-block mb-4 drop-shadow-lg drop-shadow-indigo-500/30 inverted-colors:drop-shadow-none">
							<Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
						</div>
						<h3 className="text-lg font-semibold mb-2 text-shadow-sm text-shadow-black/10">
							Deutschlandweit
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Abdeckung aller 16 Bundesländer mit 1.337 Polizeirevieren.
						</p>
					</Card>
				</div>

				{/* Stats Section */}
				<Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
						<div>
							<p className="text-4xl font-bold mb-2 text-shadow-lg text-shadow-black/30">1.337</p>
							<p className="text-blue-100">Polizeireviere</p>
						</div>
						<div>
							<p className="text-4xl font-bold mb-2 text-shadow-lg text-shadow-black/30">
								&lt;100ms
							</p>
							<p className="text-blue-100">Antwortzeit</p>
						</div>
						<div>
							<p className="text-4xl font-bold mb-2 text-shadow-lg text-shadow-black/30">24/7</p>
							<p className="text-blue-100">Verfügbarkeit</p>
						</div>
					</div>
				</Card>

				{/* CTA Section */}
				<div className="text-center mt-16">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-shadow-md text-shadow-black/15">
						Bereit für die Zukunft?
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-shadow-sm text-shadow-black/5">
						Erleben Sie die nächste Generation der Routenplanung. Schnell, sicher und immer
						verfügbar.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all pointer-coarse:px-12 pointer-coarse:py-8 pointer-coarse:text-xl text-shadow-sm text-shadow-black/20"
						>
							<MapPin className="mr-2 h-5 w-5 pointer-coarse:h-6 pointer-coarse:w-6" />
							Jetzt testen
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="px-8 py-6 text-lg pointer-coarse:px-12 pointer-coarse:py-8 pointer-coarse:text-xl text-shadow-sm text-shadow-black/10"
						>
							<Shield className="mr-2 h-5 w-5 pointer-coarse:h-6 pointer-coarse:w-6" />
							Mehr erfahren
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
