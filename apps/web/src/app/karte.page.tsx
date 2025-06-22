import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapComponent } from "@/components/ui/Map";
import { MapWithRouting } from "@/components/ui/MapWithRouting";
import { AdvancedMap } from "@/components/ui/AdvancedMap";
import { ArrowLeft, MapPin, Search, Shield, ZoomIn, ZoomOut, Layers, Settings, Zap } from "lucide-react";
import { useState } from "react";
import type { Map as MapInstance } from 'maplibre-gl';

// Sample police station data for Stuttgart area
const POLICE_STATIONS = [
	{
		id: 'stuttgart-mitte',
		name: 'Polizeirevier Stuttgart-Mitte',
		coordinates: [9.1770, 48.7758] as [number, number],
		address: 'Königstraße 1, 70173 Stuttgart'
	},
	{
		id: 'bad-cannstatt',
		name: 'Polizeirevier Bad Cannstatt',
		coordinates: [9.2167, 48.8000] as [number, number],
		address: 'Marktstraße 71, 70372 Stuttgart'
	},
	{
		id: 'feuerbach',
		name: 'Polizeirevier Feuerbach',
		coordinates: [9.1500, 48.8167] as [number, number],
		address: 'Stuttgarter Str. 45, 70469 Stuttgart'
	},
	{
		id: 'vaihingen',
		name: 'Polizeirevier Vaihingen',
		coordinates: [9.1000, 48.7333] as [number, number],
		address: 'Hauptstraße 123, 70563 Stuttgart'
	},
	{
		id: 'ditzingen',
		name: 'Polizeirevier Ditzingen',
		coordinates: [9.0667, 48.8167] as [number, number],
		address: 'Marktplatz 1, 71254 Ditzingen'
	},
	{
		id: 'leonberg',
		name: 'Polizeirevier Leonberg',
		coordinates: [9.0167, 48.8000] as [number, number],
		address: 'Römerstraße 1, 71229 Leonberg'
	},
	{
		id: 'boeblingen',
		name: 'Polizeirevier Böblingen',
		coordinates: [9.0167, 48.6833] as [number, number],
		address: 'Marktplatz 1, 71032 Böblingen'
	},
	{
		id: 'esslingen',
		name: 'Polizeirevier Esslingen',
		coordinates: [9.3000, 48.7500] as [number, number],
		address: 'Marktplatz 1, 73728 Esslingen am Neckar'
	}
];

export default function KartePage() {
	const [mapInstance, setMapInstance] = useState<MapInstance | null>(null);
	const [currentZoom, setCurrentZoom] = useState(6);
	const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
	const [mapMode, setMapMode] = useState<'basic' | 'routing' | 'advanced'>('basic');

	const handleBack = () => {
		window.history.back();
	};

	const handleMapLoad = (map: MapInstance) => {
		setMapInstance(map);
		setCurrentZoom(map.getZoom());
		
		// Listen to zoom changes
		map.on('zoom', () => {
			setCurrentZoom(map.getZoom());
		});
	};

	const handleZoomIn = () => {
		if (mapInstance) {
			mapInstance.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (mapInstance) {
			mapInstance.zoomOut();
		}
	};

	const handleGetLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { longitude, latitude } = position.coords;
					setUserLocation([longitude, latitude]);
					
					if (mapInstance) {
						mapInstance.flyTo({
							center: [longitude, latitude],
							zoom: 14,
							duration: 1500
						});
					}
				},
				(error) => {
					console.error('Error getting location:', error);
					alert('Standort konnte nicht ermittelt werden');
				}
			);
		} else {
			alert('Geolocation wird nicht unterstützt');
		}
	};

	const handleShowAllReviere = () => {
		if (mapInstance) {
			// Fit to Germany bounds
			mapInstance.fitBounds(
				[[5.9, 47.3], [15.0, 55.0]],
				{ padding: 50, duration: 1000 }
			);
		}
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
							<Button 
								variant="outline" 
								size="sm" 
								className="pointer-coarse:p-3"
								onClick={handleZoomOut}
							>
								<ZoomOut className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
							</Button>
							<Button 
								variant="outline" 
								size="sm" 
								className="pointer-coarse:p-3"
								onClick={handleZoomIn}
							>
								<ZoomIn className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
							</Button>
							<Button 
								variant="outline" 
								size="sm" 
								className="pointer-coarse:p-3"
								onClick={() => setMapMode(mapMode === 'basic' ? 'routing' : mapMode === 'routing' ? 'advanced' : 'basic')}
							>
								{mapMode === 'basic' ? (
									<Settings className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
								) : mapMode === 'routing' ? (
									<Zap className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
								) : (
									<Shield className="h-4 w-4 pointer-coarse:h-5 pointer-coarse:w-5" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Map Container */}
			<div className="relative h-[calc(100vh-5rem)]">
				{mapMode === 'advanced' ? (
					<AdvancedMap
						className="w-full h-full"
						stations={POLICE_STATIONS}
						userLocation={userLocation || undefined}
					/>
				) : mapMode === 'routing' ? (
					<MapWithRouting
						className="w-full h-full"
						stations={POLICE_STATIONS}
						userLocation={userLocation || undefined}
					/>
				) : (
					<>
						<MapComponent
							className="w-full h-full"
							onMapLoad={handleMapLoad}
							markers={POLICE_STATIONS.map(station => ({
								id: station.id,
								coordinates: station.coordinates,
								color: '#3b82f6',
								popup: `<strong>${station.name}</strong><br/>${station.address}`
							}))}
							center={userLocation || undefined}
							zoom={currentZoom}
						/>

						{/* Floating Controls */}
						<div className="absolute bottom-6 left-6 right-6">
							<Card className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 inverted-colors:shadow-none">
								<div className="flex flex-wrap justify-center-safe gap-2">
									<Button
										variant="outline"
										size="sm"
										className="pointer-coarse:px-4 pointer-coarse:py-2"
										onClick={handleShowAllReviere}
									>
										<Shield className="mr-2 h-4 w-4" />
										Alle Reviere
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="pointer-coarse:px-4 pointer-coarse:py-2"
										onClick={() => setMapMode('routing')}
									>
										<Search className="mr-2 h-4 w-4" />
										Routing
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="pointer-coarse:px-4 pointer-coarse:py-2"
										onClick={handleGetLocation}
									>
										<MapPin className="mr-2 h-4 w-4" />
										Mein Standort
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="pointer-coarse:px-4 pointer-coarse:py-2"
										onClick={() => setMapMode('advanced')}
									>
										<Zap className="mr-2 h-4 w-4" />
										Erweitert
									</Button>
								</div>
							</Card>
						</div>

						{/* Zoom Level Indicator */}
						<div className="absolute top-6 right-6">
							<Card className="px-3 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2 text-sm">
									<Layers className="h-4 w-4" />
									<span className="font-mono">Zoom: {Math.round(currentZoom)}</span>
								</div>
							</Card>
						</div>

						{/* User Location Indicator */}
						{userLocation && (
							<div className="absolute top-6 left-6">
								<Card className="px-3 py-2 bg-green-100 dark:bg-green-900/50 backdrop-blur-sm border border-green-200 dark:border-green-700">
									<div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
										<MapPin className="h-4 w-4" />
										<span>Standort aktiv</span>
									</div>
								</Card>
							</div>
						)}

						{/* Station Count Indicator */}
						<div className="absolute bottom-6 right-6">
							<Card className="px-3 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-2 text-sm">
									<Shield className="h-4 w-4" />
									<span>{POLICE_STATIONS.length} Reviere</span>
								</div>
							</Card>
						</div>

						{/* Map Mode Indicator */}
						<div className="absolute top-6 left-1/2 transform -translate-x-1/2">
							<Card className="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 backdrop-blur-sm border border-blue-200 dark:border-blue-700">
								<div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
									<Shield className="h-4 w-4" />
									<span>Basis-Modus</span>
								</div>
							</Card>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
