import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useWizardStore } from "../../stores/wizard";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { WizardControls } from "./WizardControls";
import { RevierCard } from "./RevierCard";
import { VirtualList, useVirtualListSearch } from "../ui/VirtualList";
import { VirtualListPerformance, useVirtualListPerformance } from "../ui/VirtualListPerformance";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getReviereByPraesidiumId } from "../../data/mockData";
import type { Revier } from "../../stores/wizard";

export const WizardStep2Optimized: React.FC = () => {
	const { praesidium, selectedReviere, availableReviere, toggleRevier, setAvailableReviere } =
		useWizardStore();

	const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
	const [sortBy, setSortBy] = useState<"name" | "address">("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	// Performance Monitoring
	const {
		isMonitoring,
		startMonitoring,
		stopMonitoring,
		addPerformanceData,
		getPerformanceReport,
	} = useVirtualListPerformance();

	// Mock-Daten für Reviere laden
	useEffect(() => {
		if (praesidium) {
			const reviere = getReviereByPraesidiumId(praesidium.id);
			setAvailableReviere(reviere);
		}
	}, [praesidium, setAvailableReviere]);

	// Suchfunktion für Reviere
	const searchReviere = (revier: Revier, query: string): boolean => {
		const lowerQuery = query.toLowerCase();
		return !!(
			revier.name.toLowerCase().includes(lowerQuery) ||
			(revier.contact?.address && revier.contact.address.toLowerCase().includes(lowerQuery)) ||
			(revier.contact?.phone && revier.contact.phone.includes(query)) ||
			(revier.contact?.email && revier.contact.email.toLowerCase().includes(lowerQuery))
		);
	};

	// Virtual List Search Hook
	const { query, setQuery, filteredItems, highlightIndex } = useVirtualListSearch(
		availableReviere,
		searchReviere,
	);

	// Sortierte und gefilterte Items
	const sortedAndFilteredItems = useMemo(() => {
		const items = [...filteredItems];

		items.sort((a, b) => {
			const aValue = sortBy === "name" ? a.name : a.contact?.address || "";
			const bValue = sortBy === "name" ? b.name : b.contact?.address || "";

			if (sortDirection === "asc") {
				return aValue.localeCompare(bValue);
			} else {
				return bValue.localeCompare(aValue);
			}
		});

		return items;
	}, [filteredItems, sortBy, sortDirection]);

	// Memoized values für Performance
	const selectedReviereIds = useMemo(
		() => new Set(selectedReviere.map((r) => r.id)),
		[selectedReviere],
	);

	const itemHeight = 120; // Geschätzte Höhe einer RevierCard
	const containerHeight = 400; // Container Höhe für VirtualList

	const handlePerformanceMetricsUpdate = (metrics: {
		renderTime: number;
		visibleItems: number;
		totalItems: number;
		scrollEvents: number;
		memoryUsage?: number;
	}) => {
		addPerformanceData(metrics);
	};

	const handleSortToggle = () => {
		setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
	};

	const handleSortByChange = (newSortBy: "name" | "address") => {
		setSortBy(newSortBy);
	};

	if (!praesidium) {
		return (
			<div className="max-w-2xl mx-auto text-center py-8">
				<p className="text-gray-600 dark:text-gray-300">
					Bitte wählen Sie zuerst ein Präsidium aus.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Reviere auswählen (Optimiert)
				</h1>
				<p className="text-gray-600 dark:text-gray-300 mt-2">
					Wählen Sie die Reviere aus, die Sie besuchen möchten
				</p>
			</div>

			{/* Selected Präsidium Info */}
			<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
							Ausgewähltes Präsidium
						</h3>
						<div className="mt-1 text-sm text-blue-700 dark:text-blue-300">{praesidium.name}</div>
					</div>
				</div>
			</div>

			{/* Performance Controls */}
			<div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600">
				<div className="flex items-center space-x-4">
					<Button
						variant={isMonitoring ? "destructive" : "default"}
						size="sm"
						onClick={isMonitoring ? stopMonitoring : startMonitoring}
					>
						{isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
					>
						{showPerformanceMetrics ? "Hide Metrics" : "Show Metrics"}
					</Button>
				</div>

				{isMonitoring && (
					<div className="text-sm text-gray-600 dark:text-gray-300">
						Monitoring aktiv - {getPerformanceReport()?.samples || 0} Samples
					</div>
				)}
			</div>

			{/* Suchfeld und Sortierung */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">
						Verfügbare Reviere ({sortedAndFilteredItems.length})
					</h3>
					{query && (
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{sortedAndFilteredItems.length} von {availableReviere.length} Ergebnissen
						</span>
					)}
				</div>

				<div className="flex space-x-2">
					<div className="relative flex-1">
						<Input
							type="text"
							placeholder="Reviere durchsuchen..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="pl-10"
						/>
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>

					<Button variant="outline" size="sm" onClick={handleSortToggle}>
						{sortDirection === "asc" ? "↑" : "↓"}
					</Button>
				</div>

				{/* Sortierung Buttons */}
				<div className="flex space-x-2">
					<Button
						variant={sortBy === "name" ? "default" : "outline"}
						size="sm"
						onClick={() => handleSortByChange("name")}
					>
						Nach Name
					</Button>
					<Button
						variant={sortBy === "address" ? "default" : "outline"}
						size="sm"
						onClick={() => handleSortByChange("address")}
					>
						Nach Adresse
					</Button>
				</div>
			</div>

			{/* Virtual List für Reviere */}
			{sortedAndFilteredItems.length > 0 ? (
				<div className="border border-gray-200 rounded-lg dark:border-gray-600">
					<VirtualList
						items={sortedAndFilteredItems}
						itemHeight={itemHeight}
						containerHeight={containerHeight}
						renderItem={(revier, index) => {
							const isSelected = selectedReviereIds.has(revier.id);
							const isHighlighted = highlightIndex === index;

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
						}}
						getKey={(revier) => revier.id}
						className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
						onScroll={() => {
							// Performance tracking für Scroll-Events
							if (isMonitoring) {
								addPerformanceData({
									renderTime: 0,
									visibleItems: sortedAndFilteredItems.length,
									totalItems: availableReviere.length,
									scrollEvents: 1,
								});
							}
						}}
					/>
				</div>
			) : (
				<div className="text-center py-8 text-gray-600 dark:text-gray-300">
					{query ? "Keine Reviere gefunden" : "Keine Reviere verfügbar"}
				</div>
			)}

			{/* Selection Summary */}
			{selectedReviere.length > 0 && (
				<div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-green-800 dark:text-green-200">
								{selectedReviere.length} Revier{selectedReviere.length !== 1 ? "e" : ""} ausgewählt
							</h3>
							<div className="mt-1 text-sm text-green-700 dark:text-green-300">
								{selectedReviere.map((r) => r.name).join(", ")}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Navigation */}
			<div className="pt-6">
				<WizardControls />
			</div>

			{/* Performance Metrics Display */}
			<VirtualListPerformance showMetrics={showPerformanceMetrics} />
		</div>
	);
};
