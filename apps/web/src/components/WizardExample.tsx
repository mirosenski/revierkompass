import type React from "react";
import { useWizardStore, selectCanProceedToStep2, selectCanProceedToStep3 } from "../stores/wizard";
import { RevierCard } from './RevierCard'
import { WizardControls } from './WizardControls'
import { WizardStep1 } from './WizardStep1'
import { WizardStep2 } from './WizardStep2'
import { WizardStep3 } from './WizardStep3'

export const WizardExample: React.FC = () => {
	const {
		currentStep,
		query,
		searchResults,
		praesidium,
		selectedReviere,
		availableReviere,
		setQuery,
		setSearchResults,
		choosePraesidium,
		toggleRevier,
		nextStep,
		previousStep,
		reset,
	} = useWizardStore();

	const canProceedToStep2 = useWizardStore(selectCanProceedToStep2);
	const canProceedToStep3 = useWizardStore(selectCanProceedToStep3);

	const handleSearch = (q: string) => {
		setQuery(q);
		if (q.length > 2) {
			// Mock search result
			const mockResults = [
				{ id: "pp_stuttgart", name: "PP Stuttgart", coordinates: [9.177, 48.775] as [number, number] },
				{ id: "pp_muenchen", name: "PP München", coordinates: [11.576, 48.137] as [number, number] },
			];
			setSearchResults(mockResults.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())));
		} else {
			setSearchResults([]);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Revierkompass Wizard</h1>
				<button
					type="button"
					onClick={reset}
					className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				>
					Reset
				</button>
			</div>

			{/* Step Indicator */}
			<div className="flex items-center space-x-4">
				{[1, 2, 3].map((step) => (
					<div
						key={step}
						className={`flex items-center justify-center w-8 h-8 rounded-full ${
							currentStep >= step ? "bg-blue-500 text-white" : "bg-gray-200"
						}`}
					>
						{step}
					</div>
				))}
			</div>

			{/* Step Content */}
			<div className="border rounded-lg p-6">
				{currentStep === 1 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Schritt 1: Praesidium suchen</h2>
						<input
							type="text"
							value={query}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="Praesidium suchen..."
							className="w-full p-2 border rounded"
						/>

						{searchResults.length > 0 && (
							<div className="space-y-2">
								<h3 className="font-medium">Suchergebnisse:</h3>
								{searchResults.map((result) => (
									<button
										key={result.id}
										onClick={() => choosePraesidium(result)}
										className="w-full text-left p-3 border rounded cursor-pointer hover:bg-gray-50"
									>
										<div className="font-medium">{result.name}</div>
										<div className="text-sm text-gray-600">
											Koordinaten: {result.coordinates.join(", ")}
										</div>
									</button>
								))}
							</div>
						)}

						{praesidium && (
							<div className="p-3 bg-green-50 border border-green-200 rounded">
								<strong>Ausgewählt:</strong> {praesidium.name}
							</div>
						)}
					</div>
				)}

				{currentStep === 2 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Schritt 2: Reviere auswählen</h2>
						{praesidium && (
							<div className="mb-4">
								<strong>Praesidium:</strong> {praesidium.name}
							</div>
						)}

						<div className="space-y-2">
							<h3 className="font-medium">Verfügbare Reviere:</h3>
							{availableReviere.map((revier) => (
								<button
									key={revier.id}
									onClick={() => toggleRevier(revier)}
									className={`w-full text-left p-3 border rounded cursor-pointer ${
										selectedReviere.some((r) => r.id === revier.id)
											? "bg-blue-50 border-blue-300"
											: "hover:bg-gray-50"
									}`}
								>
									<div className="font-medium">{revier.name}</div>
									{revier.contact && (
										<div className="text-sm text-gray-600">
											{revier.contact.phone && `Tel: ${revier.contact.phone}`}
											{revier.contact.email && ` | Email: ${revier.contact.email}`}
										</div>
									)}
								</button>
							))}
						</div>

						{selectedReviere.length > 0 && (
							<div className="p-3 bg-blue-50 border border-blue-200 rounded">
								<strong>Ausgewählte Reviere:</strong> {selectedReviere.length}
							</div>
						)}
					</div>
				)}

				{currentStep === 3 && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Schritt 3: Zusammenfassung</h2>
						<div className="space-y-2">
							<div>
								<strong>Praesidium:</strong> {praesidium?.name}
							</div>
							<div>
								<strong>Ausgewählte Reviere:</strong> {selectedReviere.length}
							</div>
							<ul className="list-disc list-inside">
								{selectedReviere.map((revier) => (
									<li key={revier.id}>{revier.name}</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>

			{/* Navigation */}
			<div className="flex justify-between">
				<button
					type="button"
					onClick={previousStep}
					disabled={currentStep === 1}
					className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
				>
					Zurück
				</button>

				<button
					type="button"
					onClick={nextStep}
					disabled={
						(currentStep === 1 && !canProceedToStep2) ||
						(currentStep === 2 && !canProceedToStep3) ||
						currentStep === 3
					}
					className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
				>
					{currentStep === 3 ? "Fertig" : "Weiter"}
				</button>
			</div>
		</div>
	);
};
