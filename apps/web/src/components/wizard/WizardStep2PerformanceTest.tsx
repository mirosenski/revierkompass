import { useState, useMemo } from "react";
import { useWizardStore } from "../../stores/wizard";
import { useVirtualizedData } from "../../hooks/useVirtualizedData";
import { WizardControls } from "./WizardControls";
import { RevierCard } from "./RevierCard";
import { VirtualList } from "../ui/VirtualList";
import { VirtualListPerformance, useVirtualListPerformance } from "../ui/VirtualListPerformance";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getLargeMockDataset, getReviereByPraesidiumIdLarge } from "../../data/mockDataLarge";
import type { Revier } from "../../stores/wizard";

// Icons als SVG-Komponenten
const Building2Icon = () => (
	<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
		/>
	</svg>
);

const SearchIcon = () => (
	<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
);

const ChevronLeftIcon = () => (
	<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
	</svg>
);

const ChevronRightIcon = () => (
	<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
	</svg>
);

const SortIcon = () => (
	<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
		/>
	</svg>
);

const PerformanceIcon = () => (
	<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
		/>
	</svg>
);

export function WizardStep2PerformanceTest() {
	const { praesidium, selectedReviere, toggleRevier, setAvailableReviere } = useWizardStore();

	// Performance Monitoring
	const {
		isMonitoring,
		startMonitoring,
		stopMonitoring,
		addPerformanceData,
		getPerformanceReport,
	} = useVirtualListPerformance();

	// Large dataset
	const [largeDataset] = useState(() => getLargeMockDataset());
	const [currentDataset, setCurrentDataset] = useState<"small" | "large">("small");
	const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);

	// Get reviere based on current dataset
	const getReviereForPraesidium = (praesidiumId: string): Revier[] => {
		if (currentDataset === "large") {
			return getReviereByPraesidiumIdLarge(praesidiumId, largeDataset.reviere);
		}
		// Fallback to small dataset
		return [];
	};

	// Use the advanced virtualized data hook
	const {
		displayData: reviere,
		totalItems,
		totalPages,
		currentPage,
		searchQuery,
		setSearchQuery,
		goToPage,
		nextPage,
		previousPage,
		sortBy,
		sortDirection,
		toggleSort,
	} = useVirtualizedData({
		data: praesidium ? getReviereForPraesidium(praesidium.id) : [],
		searchKeys: ["name"],
		itemsPerPage: currentDataset === "large" ? 50 : 20,
		debounceMs: 300,
	});

	// Sync with wizard store selection
	const selectedReviereIds = useMemo(
		() => new Set(selectedReviere.map((r) => r.id)),
		[selectedReviere],
	);

	const itemHeight = 120;
	const containerHeight = 400;

	const renderRevier = (revier: Revier) => {
		const isSelected = selectedReviereIds.has(revier.id);
		const isHighlighted = false;

		return (
			<div className="p-2">
				<RevierCard
					revier={revier}
					isSelected={isSelected}
					onToggle={toggleRevier}
					isHighlighted={isHighlighted}
				/>
			</div>
		);
	};

	const handleDatasetToggle = () => {
		setCurrentDataset((prev) => (prev === "small" ? "large" : "small"));
		if (praesidium) {
			const newReviere = getReviereForPraesidium(praesidium.id);
			setAvailableReviere(newReviere);
		}
	};

	const handlePerformanceMetricsUpdate = (metrics: any) => {
		addPerformanceData(metrics);
	};

	if (!praesidium) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-gray-600 dark:text-gray-300">
							Bitte wählen Sie zuerst ein Präsidium aus.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Building2Icon />
							<CardTitle className="text-gray-900 dark:text-white">
								Performance Test - {praesidium.name}
							</CardTitle>
						</div>
						<CardDescription className="text-gray-600 dark:text-gray-300">
							Test der Performance mit großen Datensätzen (
							{currentDataset === "large" ? "Groß" : "Klein"})
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Performance Controls */}
						<div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">
							<div className="flex items-center space-x-4">
								<Button
									variant={isMonitoring ? "destructive" : "default"}
									size="sm"
									onClick={isMonitoring ? stopMonitoring : startMonitoring}
								>
									<PerformanceIcon />
									{isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
								</Button>

								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
								>
									{showPerformanceMetrics ? "Hide Metrics" : "Show Metrics"}
								</Button>

								<Button variant="outline" size="sm" onClick={handleDatasetToggle}>
									Switch to {currentDataset === "small" ? "Large" : "Small"} Dataset
								</Button>
							</div>

							<div className="text-sm text-gray-600 dark:text-gray-300">
								{isMonitoring && (
									<span>Monitoring aktiv - {getPerformanceReport()?.samples || 0} Samples</span>
								)}
							</div>
						</div>

						{/* Dataset Info */}
						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
										Dataset Information
									</h3>
									<div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
										{currentDataset === "large" ? (
											<>
												<div>Großes Dataset: {largeDataset.stats.totalPraesidien} Präsidien</div>
												<div>Gesamt: {largeDataset.stats.totalReviere} Reviere</div>
												<div>
													Durchschnitt: {largeDataset.stats.avgRevierePerPraesidium} Reviere pro
													Präsidium
												</div>
											</>
										) : (
											<div>Kleines Dataset: 8 Präsidien, 58 Reviere</div>
										)}
									</div>
								</div>
								<Badge variant="default">{currentDataset === "large" ? "Large" : "Small"}</Badge>
							</div>
						</div>

						{/* Search and Controls */}
						<div className="space-y-4">
							<div className="relative">
								<SearchIcon />
								<Input
									type="text"
									placeholder="Reviere durchsuchen..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4 text-sm">
									<span className="text-gray-600 dark:text-gray-300">
										{totalItems} Reviere gefunden
									</span>
									<Badge variant="secondary">{selectedReviere.length} ausgewählt</Badge>
								</div>

								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => toggleSort("name")}
										className="flex items-center gap-1"
									>
										<SortIcon />
										Name
										{sortBy === "name" && (
											<span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
										)}
									</Button>
								</div>
							</div>
						</div>

						{/* Virtual List */}
						<div className="rounded-lg border border-gray-200 dark:border-gray-600">
							<VirtualList
								items={reviere}
								itemHeight={itemHeight}
								containerHeight={containerHeight}
								renderItem={renderRevier}
								getKey={(revier) => revier.id}
								overscan={currentDataset === "large" ? 5 : 2}
								onScroll={() => {
									if (isMonitoring) {
										addPerformanceData({
											renderTime: 0,
											visibleItems: reviere.length,
											totalItems: totalItems,
											scrollEvents: 1,
										});
									}
								}}
							/>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between">
								<div className="text-sm text-gray-600 dark:text-gray-300">
									Seite {currentPage} von {totalPages}
								</div>

								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={previousPage}
										disabled={currentPage === 1}
									>
										<ChevronLeftIcon />
										Zurück
									</Button>

									<div className="flex items-center gap-1">
										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											const page = i + 1;
											return (
												<Button
													key={page}
													variant={currentPage === page ? "default" : "outline"}
													size="sm"
													onClick={() => goToPage(page)}
													className="w-8 h-8 p-0"
												>
													{page}
												</Button>
											);
										})}
									</div>

									<Button
										variant="outline"
										size="sm"
										onClick={nextPage}
										disabled={currentPage === totalPages}
									>
										Weiter
										<ChevronRightIcon />
									</Button>
								</div>
							</div>
						)}

						{/* Quick Actions */}
						{reviere.length > 0 && (
							<div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										reviere.forEach((r) => {
											if (!selectedReviere.some((sr) => sr.id === r.id)) {
												toggleRevier(r);
											}
										})
									}
								>
									Alle auf dieser Seite auswählen
								</Button>
								<span className="text-gray-400">•</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => selectedReviere.forEach((r) => toggleRevier(r))}
									disabled={selectedReviere.length === 0}
								>
									Auswahl aufheben
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				<WizardControls />
			</div>

			{/* Performance Metrics Display */}
			<VirtualListPerformance
				showMetrics={showPerformanceMetrics}
			/>
		</div>
	);
}
