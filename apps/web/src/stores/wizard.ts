import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Types
export interface Praesidium {
	id: string;
	name: string;
	coordinates: [number, number];
	childReviere: string[];
}

export interface Revier {
	id: string;
	name: string;
	praesidiumId: string;
	geometry: {
		type: string;
		coordinates: number[][];
	}; // GeoJSON geometry
	contact?: {
		phone?: string;
		email?: string;
		address?: string;
	};
}

interface WizardState {
	// Step 0 - Start location
	startAddress?: string;
	startCoords?: [number, number];

	// Step 1 - Search
	query: string;
	searchResults: Praesidium[];
	praesidium?: Praesidium;

	// Step 2 - Reviere selection
	selectedReviere: Revier[];
	availableReviere: Revier[];

	// Navigation
	currentStep: number;

	// Actions
	setStart: (addr: string, coords?: [number, number]) => void;
	setQuery: (q: string) => void;
	setSearchResults: (results: Praesidium[]) => void;
	choosePraesidium: (p: Praesidium) => void;
	toggleRevier: (revier: Revier) => void;
	setAvailableReviere: (reviere: Revier[]) => void;
	nextStep: () => void;
	previousStep: () => void;
	goToStep: (step: number) => void;
	reset: () => void;
}

const initialState = {
	query: "",
	searchResults: [],
	selectedReviere: [],
	availableReviere: [],
	currentStep: 1,
};

export const useWizardStore = create<WizardState>()(
	devtools(
		persist(
			subscribeWithSelector(
				immer((set) => ({
					...initialState,

					setStart: (addr, coords) =>
						set((state) => {
							state.startAddress = addr;
							state.startCoords = coords;
						}),

					setQuery: (q) =>
						set((state) => {
							state.query = q;
						}),

					setSearchResults: (results) =>
						set((state) => {
							state.searchResults = results;
						}),

					choosePraesidium: (p) =>
						set((state) => {
							state.praesidium = p;
							state.currentStep = 2;
						}),

					toggleRevier: (revier) =>
						set((state) => {
							const index = state.selectedReviere.findIndex((r) => r.id === revier.id);
							if (index >= 0) {
								state.selectedReviere.splice(index, 1);
							} else {
								state.selectedReviere.push(revier);
							}
						}),

					setAvailableReviere: (reviere) =>
						set((state) => {
							state.availableReviere = reviere;
						}),

					nextStep: () =>
						set((state) => {
							if (state.currentStep < 3) {
								state.currentStep += 1;
							}
						}),

					previousStep: () =>
						set((state) => {
							if (state.currentStep > 1) {
								state.currentStep -= 1;
							}
						}),

					goToStep: (step) =>
						set((state) => {
							state.currentStep = Math.max(1, Math.min(3, step));
						}),

					reset: () => set(() => initialState),
				})),
			),
			{
				name: "revierkompass-wizard",
				partialize: (state) => ({
					startAddress: state.startAddress,
					startCoords: state.startCoords,
					query: state.query,
					praesidium: state.praesidium,
					selectedReviere: state.selectedReviere,
					currentStep: state.currentStep,
				}),
			},
		),
		{
			name: "WizardStore",
		},
	),
);

// Selectors
export const selectCanProceedToStep2 = (state: WizardState) => !!state.praesidium;
export const selectCanProceedToStep3 = (state: WizardState) => state.selectedReviere.length > 0;
export const selectIsStepCompleted = (step: number) => (state: WizardState) => {
	switch (step) {
		case 1:
			return selectCanProceedToStep2(state);
		case 2:
			return selectCanProceedToStep3(state);
		default:
			return false;
	}
};
