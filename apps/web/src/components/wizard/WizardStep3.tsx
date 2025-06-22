import { useState, useMemo } from 'react'
import { useWizardStore, type Revier } from '@/stores/wizard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Clock, Download, Copy, ExternalLink } from 'lucide-react'
import { MapView } from '@/components/ui/MapView'
import { WizardControls } from './WizardControls'
import { formatDistance, formatDuration } from '@/services/osrm'

export function WizardStep3() {
	const { startAddress, startCoords, praesidium, selectedReviere } = useWizardStore()
	const [routeInfo, setRouteInfo] = useState<{
		distance: number
		duration: number
		geometry: number[][]
	} | null>(null)
	
	// Prepare destinations for map
	const destinations = useMemo(() => {
		return selectedReviere.map((revier: Revier) => ({
			id: revier.id,
			name: revier.name,
			coordinates: [
				// Use mock coordinates for now
				8.6821 + (Math.random() - 0.5) * 0.5,
				50.1109 + (Math.random() - 0.5) * 0.5,
			] as [number, number],
			address: revier.contact?.address,
		}))
	}, [selectedReviere])
	
	const handleExportExcel = () => {
		// TODO: Implement Excel export
		console.log('Export to Excel')
	}
	
	const handleCopyToClipboard = () => {
		const data = {
			start: {
				address: startAddress,
				coordinates: startCoords,
			},
			praesidium: praesidium?.name,
			reviere: selectedReviere.map((r: Revier) => ({
				name: r.name,
				address: r.contact?.address,
				phone: r.contact?.phone,
				email: r.contact?.email,
			})),
			route: routeInfo ? {
				distance: formatDistance(routeInfo.distance),
				duration: formatDuration(routeInfo.duration),
			} : null,
		}
		
		navigator.clipboard.writeText(JSON.stringify(data, null, 2))
			.then(() => alert('Daten in Zwischenablage kopiert!'))
			.catch(err => console.error('Clipboard error:', err))
	}
	
	const handleOpenInMaps = () => {
		if (!startCoords || destinations.length === 0) return
		
		// Create Google Maps URL with waypoints
		const origin = `${startCoords[1]},${startCoords[0]}`
		const dest = destinations[destinations.length - 1]
		const destination = `${dest.coordinates[1]},${dest.coordinates[0]}`
		
		let url = `https://www.google.com/maps/dir/${origin}`
		
		// Add waypoints
		destinations.slice(0, -1).forEach((wp: { coordinates: [number, number] }) => {
			url += `/${wp.coordinates[1]},${wp.coordinates[0]}`
		})
		
		url += `/${destination}`
		
		window.open(url, '_blank')
	}
	
	if (!praesidium || selectedReviere.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-muted-foreground">
							Bitte vervollständigen Sie zuerst die vorherigen Schritte.
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}
	
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-7xl space-y-6">
				{/* Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Routenzusammenfassung</CardTitle>
						<CardDescription>
							Ihre optimierte Route zu den ausgewählten Revieren
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">Startpunkt</p>
								<div className="flex items-start gap-2">
									<MapPin className="h-4 w-4 mt-0.5 text-green-600" />
									<div>
										<p className="font-medium">{startAddress || 'Aktueller Standort'}</p>
										{startCoords && (
											<p className="text-xs text-muted-foreground">
												{startCoords[1].toFixed(6)}, {startCoords[0].toFixed(6)}
											</p>
										)}
									</div>
								</div>
							</div>
							
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">Präsidium</p>
								<p className="font-medium">{praesidium.name}</p>
								<Badge variant="secondary">{selectedReviere.length} Reviere</Badge>
							</div>
							
							{routeInfo && (
								<div className="space-y-2">
									<p className="text-sm text-muted-foreground">Route</p>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-1">
											<Navigation className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">{formatDistance(routeInfo.distance)}</span>
										</div>
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">{formatDuration(routeInfo.duration)}</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
				
				{/* Map and Reviere List */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Map */}
					<Card className="overflow-hidden">
						<CardHeader>
							<CardTitle>Karte</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<MapView
								startCoordinates={startCoords}
								destinations={destinations}
								className="h-[500px]"
								onRouteCalculated={setRouteInfo}
							/>
						</CardContent>
					</Card>
					
					{/* Reviere List */}
					<Card>
						<CardHeader>
							<CardTitle>Ausgewählte Reviere</CardTitle>
							<CardDescription>
								In optimierter Reihenfolge für die Route
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-lg border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-12">#</TableHead>
											<TableHead>Revier</TableHead>
											<TableHead>Kontakt</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{selectedReviere.map((revier: Revier, index: number) => (
											<TableRow key={revier.id}>
												<TableCell className="font-medium">{index + 1}</TableCell>
												<TableCell>
													<div>
														<p className="font-medium">{revier.name}</p>
														{revier.contact?.address && (
															<p className="text-sm text-muted-foreground">
																{revier.contact.address}
															</p>
														)}
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-1 text-sm">
														{revier.contact?.phone && (
															<p>{revier.contact.phone}</p>
														)}
														{revier.contact?.email && (
															<p className="text-muted-foreground">
																{revier.contact.email}
															</p>
														)}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</div>
				
				{/* Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Aktionen</CardTitle>
						<CardDescription>
							Exportieren Sie Ihre Route oder öffnen Sie sie in anderen Apps
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Button onClick={handleExportExcel} className="gap-2">
								<Download className="h-4 w-4" />
								Excel exportieren
							</Button>
							<Button variant="outline" onClick={handleCopyToClipboard} className="gap-2">
								<Copy className="h-4 w-4" />
								In Zwischenablage
							</Button>
							<Button variant="outline" onClick={handleOpenInMaps} className="gap-2">
								<ExternalLink className="h-4 w-4" />
								In Google Maps öffnen
							</Button>
						</div>
					</CardContent>
				</Card>
				
				<WizardControls />
			</div>
		</div>
	)
}
