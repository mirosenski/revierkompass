import { useEffect, useMemo, useState } from "react";
import { useWizardStore } from "../../stores/wizard";
import { useVirtualListSearch } from "../ui/VirtualList";
import { WizardControls } from "./WizardControls";
import { RevierCard } from "./RevierCard";
import { VirtualList } from "../ui/VirtualList";
import { Input } from "../ui/input";
import { getReviereByPraesidiumId } from "../../data/mockData";
import type { Revier } from "../../stores/wizard";

export const WizardStep2: React.FC = () => {
	const { praesidium, selectedReviere, toggleRevier, setAvailableReviere } = useWizardStore();
	const [availableReviere, setLocalAvailableReviere] = useState<Revier[]>([]);

	// Mock-Daten für Reviere laden
	useEffect(() => {
		if (praesidium) {
			const reviere = getReviereByPraesidiumId(praesidium.id);
			setLocalAvailableReviere(reviere);
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

	// Memoized values für Performance
	const selectedReviereIds = useMemo(
		() => new Set(selectedReviere.map((r) => r.id)),
		[selectedReviere],
	);

	const itemHeight = 120; // Geschätzte Höhe einer RevierCard
	const containerHeight = 400; // Container Höhe für VirtualList

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
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reviere auswählen</h1>
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

			{/* Suchfeld */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">
						Verfügbare Reviere ({filteredItems.length})
					</h3>
					{query && (
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{filteredItems.length} von {availableReviere.length} Ergebnissen
						</span>
					)}
				</div>

				<div className="relative">
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
			</div>

			{/* Virtual List für Reviere */}
			{filteredItems.length > 0 ? (
				<div className="border border-gray-200 rounded-lg dark:border-gray-600">
					<VirtualList
						items={filteredItems}
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
		</div>
	);
};
