import { useEffect, useState, useMemo, useCallback } from "react";
import { useWizardStore } from "../../stores/wizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { VirtualList, useVirtualListSearch } from "../ui/VirtualList";
import { WizardControls } from "./WizardControls";
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

const PhoneIcon = () => (
	<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
		/>
	</svg>
);

const MailIcon = () => (
	<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
		/>
	</svg>
);

const MapPinIcon = () => (
	<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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

export function WizardStep2Modern() {
	const { praesidium, selectedReviere, toggleRevier, setAvailableReviere } = useWizardStore();
	const [reviere, setReviere] = useState<Revier[]>([]);

	// Load reviere when component mounts
	useEffect(() => {
		if (praesidium) {
			const availableReviere = getReviereByPraesidiumId(praesidium.id);
			setReviere(availableReviere);
			setAvailableReviere(availableReviere);
		}
	}, [praesidium, setAvailableReviere]);

	// Search functionality
	const searchFn = useCallback((revier: Revier, query: string) => {
		const searchTerm = query.toLowerCase();
		return !!(
			revier.name.toLowerCase().includes(searchTerm) ||
			revier.contact?.address?.toLowerCase().includes(searchTerm) ||
			revier.contact?.phone?.toLowerCase().includes(searchTerm) ||
			revier.contact?.email?.toLowerCase().includes(searchTerm)
		);
	}, []);

	const { query, setQuery, filteredItems } = useVirtualListSearch(reviere, searchFn);

	// Sort reviere by selection status and name
	const sortedReviere = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
			const aSelected = selectedReviere.some((r) => r.id === a.id);
			const bSelected = selectedReviere.some((r) => r.id === b.id);

			if (aSelected && !bSelected) return -1;
			if (!aSelected && bSelected) return 1;
			return a.name.localeCompare(b.name);
		});
	}, [filteredItems, selectedReviere]);

	const renderRevier = useCallback(
		(revier: Revier) => {
			const isSelected = selectedReviere.some((r) => r.id === revier.id);

			return (
				<Card
					className={`mx-4 cursor-pointer transition-all ${
						isSelected
							? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
							: "hover:border-gray-300 dark:hover:border-gray-600"
					}`}
					onClick={() => toggleRevier(revier)}
				>
					<CardContent className="p-4">
						<div className="flex items-start gap-4">
							<Checkbox
								checked={isSelected}
								onCheckedChange={() => toggleRevier(revier)}
								onClick={(e) => e.stopPropagation()}
								className="mt-1"
							/>

							<div className="flex-1 space-y-2">
								<div className="flex items-center justify-between">
									<h4 className="font-semibold text-gray-900 dark:text-white">{revier.name}</h4>
									{isSelected && <Badge variant="default">Ausgewählt</Badge>}
								</div>

								{revier.contact && (
									<div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
										{revier.contact.address && (
											<div className="flex items-center gap-2">
												<MapPinIcon />
												<span>{revier.contact.address}</span>
											</div>
										)}
										{revier.contact.phone && (
											<div className="flex items-center gap-2">
												<PhoneIcon />
												<span>{revier.contact.phone}</span>
											</div>
										)}
										{revier.contact.email && (
											<div className="flex items-center gap-2">
												<MailIcon />
												<span>{revier.contact.email}</span>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			);
		},
		[selectedReviere, toggleRevier],
	);

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
								Reviere des {praesidium.name}
							</CardTitle>
						</div>
						<CardDescription className="text-gray-600 dark:text-gray-300">
							Wählen Sie die Reviere aus, für die Sie die Route berechnen möchten
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4">
						{/* Search and stats */}
						<div className="space-y-4">
							<div className="relative">
								<SearchIcon />
								<Input
									type="text"
									placeholder="Reviere durchsuchen..."
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="pl-10"
								/>
							</div>

							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600 dark:text-gray-300">
									{sortedReviere.length} von {reviere.length} Reviere
								</span>
								<Badge variant="secondary">{selectedReviere.length} ausgewählt</Badge>
							</div>
						</div>

						{/* Virtual List */}
						<div className="rounded-lg border border-gray-200 dark:border-gray-600">
							<VirtualList
								items={sortedReviere}
								itemHeight={120}
								containerHeight={400}
								renderItem={renderRevier}
								getKey={(revier) => revier.id}
								overscan={2}
								className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
							/>
						</div>

						{/* Quick actions */}
						{sortedReviere.length > 0 && (
							<div className="flex gap-2">
								<button
									onClick={() =>
										sortedReviere.forEach((r) => {
											if (!selectedReviere.some((sr) => sr.id === r.id)) {
												toggleRevier(r);
											}
										})
									}
									className="text-sm text-blue-600 hover:underline dark:text-blue-400"
								>
									Alle auswählen
								</button>
								<span className="text-gray-400">•</span>
								<button
									onClick={() => selectedReviere.forEach((r) => toggleRevier(r))}
									className="text-sm text-blue-600 hover:underline dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={selectedReviere.length === 0}
								>
									Auswahl aufheben
								</button>
							</div>
						)}
					</CardContent>
				</Card>

				<WizardControls />
			</div>
		</div>
	);
}
