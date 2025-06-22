import { useEffect, useMemo } from "react";
import { useWizardStore } from "../../stores/wizard";
import { useVirtualizedData } from "../../hooks/useVirtualizedData";
import { WizardControls } from "./WizardControls";
import { RevierCard } from "./RevierCard";
import { VirtualList } from "../ui/VirtualList";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getReviereByPraesidiumId } from "../../data/mockData";
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

export function WizardStep2Advanced() {
	const { praesidium, selectedReviere, toggleRevier, setAvailableReviere } = useWizardStore();

	// Load reviere when component mounts
	useEffect(() => {
		if (praesidium) {
			const availableReviere = getReviereByPraesidiumId(praesidium.id);
			setAvailableReviere(availableReviere);
		}
	}, [praesidium, setAvailableReviere]);

	// Use the advanced virtualized data hook
	const {
		displayData: reviere,
		searchQuery,
		setSearchQuery,
		currentPage,
		totalPages,
		totalItems,
		goToPage,
		nextPage,
		previousPage,
		sortBy,
		sortDirection,
		toggleSort,
	} = useVirtualizedData({
		data: praesidium ? getReviereByPraesidiumId(praesidium.id) : [],
		searchKeys: ["name"],
		itemsPerPage: 20,
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

		return (
			<div className="p-2">
				<RevierCard
					revier={revier}
					isSelected={isSelected}
					onToggle={toggleRevier}
					isHighlighted={false}
				/>
			</div>
		);
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
								Reviere des {praesidium.name} (Advanced)
							</CardTitle>
						</div>
						<CardDescription className="text-gray-600 dark:text-gray-300">
							Erweiterte Verwaltung großer Revier-Listen mit Paginierung und Sortierung
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
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
								renderItem={(revier) => {
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
								}}
								getKey={(revier) => revier.id}
								overscan={5}
								className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
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
										reviere.forEach((r: Revier) => {
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
		</div>
	);
}
