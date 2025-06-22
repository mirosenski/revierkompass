import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Search, Shield } from "lucide-react";

export default function WizardPage() {
	const handleBack = () => {
		window.history.back();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={handleBack}
						className="mb-4 pointer-coarse:p-3 pointer-coarse:text-lg"
					>
						<ArrowLeft className="mr-2 h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
						Zurück
					</Button>
					
					<h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 text-shadow-lg text-shadow-black/20 dark:text-shadow-white/10">
						Routen-Wizard
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-400 text-shadow-sm text-shadow-black/10 dark:text-shadow-white/5">
						Finden Sie die optimale Route zu Ihrem Polizeirevier
					</p>
				</div>

				{/* Wizard Steps */}
				<div className="grid gap-6 max-w-4xl mx-auto">
					{/* Step 1: Adresseingabe */}
					<Card className="p-6 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
								1
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-shadow-sm text-shadow-black/10">
								Ihre Adresse
							</h2>
						</div>
						
						<div className="space-y-4">
							<div>
								<label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Straße & Hausnummer
								</label>
								<input
									type="text"
									id="street"
									required
									className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white user-invalid:border-red-500 user-valid:border-green-500 pointer-coarse:py-4 pointer-coarse:text-lg"
									placeholder="z.B. Musterstraße 123"
								/>
							</div>
							
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										PLZ
									</label>
									<input
										type="text"
										id="zip"
										required
										className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white user-invalid:border-red-500 user-valid:border-green-500 pointer-coarse:py-4 pointer-coarse:text-lg"
										placeholder="70173"
									/>
								</div>
								<div className="sm:col-span-2">
									<label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Stadt
									</label>
									<input
										type="text"
										id="city"
										required
										className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white user-invalid:border-red-500 user-valid:border-green-500 pointer-coarse:py-4 pointer-coarse:text-lg"
										placeholder="Stuttgart"
									/>
								</div>
							</div>
						</div>
					</Card>

					{/* Step 2: Revierauswahl */}
					<Card className="p-6 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
								2
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-shadow-sm text-shadow-black/10">
								Polizeirevier wählen
							</h2>
						</div>
						
						<div className="space-y-4">
							<p className="text-gray-600 dark:text-gray-400">
								Wählen Sie das gewünschte Polizeirevier aus:
							</p>
							
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{/* Beispiel-Reviere mit wrap-anywhere für lange Namen */}
								<Button
									variant="outline"
									className="h-auto p-4 text-left flex flex-col items-start pointer-coarse:p-6"
								>
									<div className="flex items-center gap-2 mb-2">
										<Shield className="h-5 w-5 text-blue-600" />
										<span className="font-semibold">Stuttgart-Mitte</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 wrap-anywhere">
										Königstraße 1, 70173 Stuttgart
									</p>
								</Button>
								
								<Button
									variant="outline"
									className="h-auto p-4 text-left flex flex-col items-start pointer-coarse:p-6"
								>
									<div className="flex items-center gap-2 mb-2">
										<Shield className="h-5 w-5 text-blue-600" />
										<span className="font-semibold">Stuttgart-Bad Cannstatt</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 wrap-anywhere">
										Marktstraße 71, 70372 Stuttgart
									</p>
								</Button>
								
								<Button
									variant="outline"
									className="h-auto p-4 text-left flex flex-col items-start pointer-coarse:p-6"
								>
									<div className="flex items-center gap-2 mb-2">
										<Shield className="h-5 w-5 text-blue-600" />
										<span className="font-semibold">Ulm-Blaustein-Vorstadt</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 wrap-anywhere">
										Lange-Strasse-123, 89077 Ulm
									</p>
								</Button>
							</div>
						</div>
					</Card>

					{/* Step 3: Routenoptionen */}
					<Card className="p-6 border border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
								3
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-shadow-sm text-shadow-black/10">
								Routenoptionen
							</h2>
						</div>
						
						<div className="space-y-4">
							<div className="flex flex-wrap justify-center-safe gap-2">
								<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
									Schnellste Route
								</span>
								<span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
									Kürzeste Strecke
								</span>
								<span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
									Verkehrsoptimiert
								</span>
								<span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
									Öffentliche Verkehrsmittel
								</span>
							</div>
							
							<Button
								size="lg"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white pointer-coarse:py-6 pointer-coarse:text-xl"
							>
								<Search className="mr-2 h-5 w-5 pointer-coarse:h-6 pointer-coarse:w-6" />
								Route berechnen
							</Button>
						</div>
					</Card>

					{/* FAQ Section mit details-content */}
					<Card className="p-6 border border-gray-200 dark:border-gray-700">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-shadow-sm text-shadow-black/10">
							Häufige Fragen
						</h3>
						
						<div className="space-y-3">
							<details className="rounded-lg border border-gray-200 dark:border-gray-600 p-4 details-content:mt-3 details-content:-ml-1 details-content:border-l-4 details-content:border-l-blue-500 dark:details-content:border-l-blue-400">
								<summary className="text-sm leading-6 font-semibold text-gray-900 dark:text-white select-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
									Wie funktioniert die Routenberechnung?
								</summary>
								<div className="border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-800/50 py-3 pl-3 mt-3 rounded-r-lg">
									<p className="text-sm text-gray-700 dark:text-gray-300">
										Unsere intelligente Routenberechnung nutzt Echtzeitdaten und berücksichtigt Verkehrslage, 
										Baustellen und aktuelle Sperrungen für die optimale Streckenführung.
									</p>
								</div>
							</details>
							
							<details className="rounded-lg border border-gray-200 dark:border-gray-600 p-4 details-content:mt-3 details-content:-ml-1 details-content:border-l-4 details-content:border-l-green-500 dark:details-content:border-l-green-400">
								<summary className="text-sm leading-6 font-semibold text-gray-900 dark:text-white select-none cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors">
									Ist die App offline verfügbar?
								</summary>
								<div className="border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-800/50 py-3 pl-3 mt-3 rounded-r-lg">
									<p className="text-sm text-gray-700 dark:text-gray-300">
										Ja! RevierKompass funktioniert als Progressive Web App auch ohne Internetverbindung. 
										Alle wichtigen Daten werden lokal gespeichert.
									</p>
								</div>
							</details>
							
							<details className="rounded-lg border border-gray-200 dark:border-gray-600 p-4 details-content:mt-3 details-content:-ml-1 details-content:border-l-4 details-content:border-l-orange-500 dark:details-content:border-l-orange-400">
								<summary className="text-sm leading-6 font-semibold text-gray-900 dark:text-white select-none cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
									Wie aktuell sind die Revierdaten?
								</summary>
								<div className="border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-800/50 py-3 pl-3 mt-3 rounded-r-lg">
									<p className="text-sm text-gray-700 dark:text-gray-300">
										Unsere Datenbank wird täglich aktualisiert und enthält alle 1.337 Polizeireviere in Deutschland 
										mit aktuellen Adressen und Kontaktdaten.
									</p>
								</div>
							</details>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
