import type React from "react";
import { useState } from "react";
import { useWizardStore } from "../../stores/wizard";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { AddressAutocomplete } from "../ui/AddressAutocomplete";
import { WizardControls } from "./WizardControls";
import { searchPraesidien } from "../../data/mockData";

export const WizardStep1: React.FC = () => {
	const {
		startAddress,
		startCoords,
		query,
		searchResults,
		praesidium,
		setStart,
		setQuery,
		setSearchResults,
		choosePraesidium,
	} = useWizardStore();

	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async (searchTerm: string) => {
		setQuery(searchTerm);

		if (searchTerm.length < 3) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);

		// Simulierte API-Abfrage mit erweiterten Mock-Daten
		setTimeout(() => {
			const results = searchPraesidien(searchTerm);
			setSearchResults(results);
			setIsSearching(false);
		}, 300);
	};

	const handleAddressSelect = (address: string, coordinates: [number, number]) => {
		setStart(address, coordinates);
	};

	const handleAddressClear = () => {
		setStart("", undefined);
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Route finden</h1>
				<p className="text-gray-600 dark:text-gray-300 mt-2">
					Geben Sie Ihre Startadresse ein und wählen Sie Ihr Ziel-Präsidium
				</p>
			</div>

			{/* Step Indicator */}
			<div className="flex items-center justify-center space-x-4">
				{[1, 2, 3].map((step) => (
					<div
						key={step}
						className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
							step === 1
								? "bg-blue-500 border-blue-500 text-white"
								: "border-gray-300 text-gray-500"
						}`}
					>
						{step}
					</div>
				))}
			</div>

			{/* Start Address Section */}
			<div className="space-y-4">
				<div>
					<label
						htmlFor="start-address"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Startadresse
					</label>
					<AddressAutocomplete
						value={startAddress || ""}
						onSelect={handleAddressSelect}
						onClear={handleAddressClear}
						placeholder="Geben Sie Ihre Startadresse ein..."
					/>
				</div>

				{startCoords && (
					<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
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
									Startadresse gesetzt
								</h3>
								<div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
									Koordinaten: {startCoords[0].toFixed(4)}, {startCoords[1].toFixed(4)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Präsidium Search Section */}
			<div className="space-y-4">
				<div>
					<label
						htmlFor="search"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Präsidium suchen
					</label>
					<input
						id="search"
						type="text"
						value={query}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Geben Sie den Namen eines Präsidiums ein..."
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
					/>
				</div>

				{/* Search Results */}
				{isSearching && (
					<div className="text-center py-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
						<p className="text-gray-600 dark:text-gray-300 mt-2">Suche läuft...</p>
					</div>
				)}

				{searchResults.length > 0 && !isSearching && (
					<div className="space-y-2">
						<h3 className="font-medium text-gray-900 dark:text-white">Suchergebnisse:</h3>
						{searchResults.map((result) => (
							<div
								key={result.id}
								onClick={() => choosePraesidium(result)}
								className={`p-4 border rounded-lg cursor-pointer transition-colors ${
									praesidium?.id === result.id
										? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
										: "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
								}`}
							>
								<div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
								<div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
									{result.childReviere.length} Reviere verfügbar
								</div>
							</div>
						))}
					</div>
				)}

				{query.length > 0 && searchResults.length === 0 && !isSearching && (
					<div className="text-center py-4 text-gray-600 dark:text-gray-300">
						Keine Präsidien gefunden
					</div>
				)}
			</div>

			{/* Selected Präsidium */}
			{praesidium && (
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
								Präsidium ausgewählt
							</h3>
							<div className="mt-1 text-sm text-green-700 dark:text-green-300">
								{praesidium.name}
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
