import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Search, Shield, ZoomIn, ZoomOut } from "lucide-react";

export default function KartePage() {
	const handleBack = () => {
		window.history.back();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
			{/* Header */}
			<div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={handleBack}
							className="pointer-coarse:p-3 pointer-coarse:text-lg"
						>
							<ArrowLeft className="mr-2 h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
							Zurück
						</Button>

						<h1 className="text-2xl font-bold text-gray-900 dark:text-white text-shadow-sm text-shadow-black/10">
							Kartenansicht
						</h1>

						<div className="flex gap-2">
							<Button variant="outline" size="sm" className="pointer-coarse:p-3">
								<ZoomOut className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
							</Button>
							<Button variant="outline" size="sm" className="pointer-coarse:p-3">
								<ZoomIn className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Map Container mit Masking */}
			<div className="relative h-[calc(100vh-5rem)]">
				{/* Placeholder für echte Karte */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-blue-900/30">
					{/* Erweiterte Masking-Effekte */}
					<div className="absolute inset-0 mask-radial-from-transparent mask-radial-to-black mask-radial-at-center opacity-20" />
					<div className="absolute inset-0 mask-b-from-50% mask-radial-[50%_90%] mask-radial-from-80% opacity-10" />

					{/* Grid Pattern */}
					<div className="absolute inset-0 bg-grid-gray-300/50 dark:bg-grid-gray-600/50 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />

					{/* Center Content */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-center">
							<MapPin className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 drop-shadow-lg drop-shadow-blue-500/30 inverted-colors:drop-shadow-none" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-shadow-lg text-shadow-black/20 dark:text-shadow-white/10">
								Interaktive Karte
							</h2>
							<p className="text-gray-600 dark:text-gray-400 text-shadow-sm text-shadow-black/10">
								Hier werden alle Polizeireviere angezeigt
							</p>
						</div>
					</div>
				</div>

				{/* Floating Controls mit safe alignment */}
				<div className="absolute bottom-6 left-6 right-6">
					<Card className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 inverted-colors:shadow-none">
						<div className="flex flex-wrap justify-center-safe gap-2">
							<Button
								variant="outline"
								size="sm"
								className="pointer-coarse:px-4 pointer-coarse:py-2"
							>
								<Shield className="mr-2 h-4 w-4" />
								Alle Reviere
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="pointer-coarse:px-4 pointer-coarse:py-2"
							>
								<Search className="mr-2 h-4 w-4" />
								In der Nähe
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="pointer-coarse:px-4 pointer-coarse:py-2"
							>
								<MapPin className="mr-2 h-4 w-4" />
								Mein Standort
							</Button>
						</div>
					</Card>
				</div>

				{/* Sample Police Stations mit erweiterten Effekten */}
				<div className="absolute top-1/4 left-1/4">
					<div className="relative">
						<div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg drop-shadow-lg drop-shadow-red-500/50 inverted-colors:drop-shadow-none" />
						<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm inverted-colors:shadow-none">
							<strong>Stuttgart-Mitte</strong>
							<br />
							<span className="text-gray-600 dark:text-gray-400">Königstraße 1</span>
						</div>
					</div>
				</div>

				<div className="absolute top-1/3 right-1/3">
					<div className="relative">
						<div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg drop-shadow-lg drop-shadow-blue-500/50 inverted-colors:drop-shadow-none" />
						<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm inverted-colors:shadow-none">
							<strong>Bad Cannstatt</strong>
							<br />
							<span className="text-gray-600 dark:text-gray-400">Marktstraße 71</span>
						</div>
					</div>
				</div>

				<div className="absolute bottom-1/3 left-1/3">
					<div className="relative">
						<div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg drop-shadow-lg drop-shadow-green-500/50 inverted-colors:drop-shadow-none" />
						<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm inverted-colors:shadow-none">
							<strong>Feuerbach</strong>
							<br />
							<span className="text-gray-600 dark:text-gray-400">Stuttgarter Str. 45</span>
						</div>
					</div>
				</div>

				{/* Neue Station mit Masking-Effekt */}
				<div className="absolute bottom-1/4 right-1/4">
					<div className="relative">
						<div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg drop-shadow-lg drop-shadow-purple-500/50 inverted-colors:drop-shadow-none" />
						<div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 whitespace-nowrap text-sm inverted-colors:shadow-none">
							<strong>Vaihingen</strong>
							<br />
							<span className="text-gray-600 dark:text-gray-400">Hauptstraße 123</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
