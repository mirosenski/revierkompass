import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { MapPin, Loader2, X } from "lucide-react";
import {
	searchAddress,
	formatAddress,
	getCoordinates,
	type NominatimPlace,
} from "../../services/nominatim";
import { useDebounce } from "use-debounce";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Command, CommandItem, CommandList } from "cmdk";

interface AddressAutocompleteProps {
	placeholder?: string;
	value?: string;
	onSelect: (address: string, coordinates: [number, number], precision?: string) => void;
	onClear?: () => void;
	className?: string;
	autoFocus?: boolean;
}

// Erweiterte Nominatim-Place mit Präzisions-Bewertung
interface EnhancedPlace extends NominatimPlace {
	precision?: "submeter" | "meter" | "street" | "city" | "region";
	source: "nominatim" | "enhanced";
	confidence?: number;
	score?: number;
}

// Erweiterte Nominatim-Suche mit Präzisions-Bewertung
const searchNominatimEnhanced = async (query: string): Promise<EnhancedPlace[]> => {
	try {
		// Erste Suche mit Standard-Parametern
		const results = await searchAddress(query, {
			limit: 10,
			countrycodes: "de",
			addressdetails: true,
		});

		// Zweite Suche mit erweiterten Parametern für bessere Ergebnisse
		const extendedResults = await searchAddress(query, {
			limit: 5,
			countrycodes: "de",
			addressdetails: true,
		});

		// Ergebnisse kombinieren und deduplizieren
		const allResults = [...results, ...extendedResults];
		const uniqueResults = allResults.filter((place, index, self) => {
			return index === self.findIndex((r) => r.place_id === place.place_id);
		});

		return uniqueResults.map((place) => ({
			...place,
			precision: determinePrecision(place),
			source: "nominatim" as const,
			confidence: calculateConfidence(place),
			score: calculateScore(place),
		}));
	} catch (error) {
		console.error("Nominatim geocoding error:", error);
		return [];
	}
};

// Präzisions-Bestimmung basierend auf Place-Details
const determinePrecision = (place: NominatimPlace): EnhancedPlace["precision"] => {
	if (place.class === "building" || place.class === "amenity") return "submeter";
	if (place.class === "highway" && place.address?.house_number) return "meter";
	if (place.class === "highway") return "street";
	if (place.class === "place" && place.type === "city") return "city";
	if (place.class === "place" && place.type === "state") return "region";
	return "region";
};

// Konfidenz-Berechnung basierend auf Place-Details
const calculateConfidence = (place: NominatimPlace): number => {
	let confidence = 0.3; // Basis-Konfidenz

	// Hausnummer erhöht Konfidenz erheblich
	if (place.address?.house_number) confidence += 0.4;

	// Postleitzahl erhöht Konfidenz
	if (place.address?.postcode) confidence += 0.2;

	// Straßenname erhöht Konfidenz
	if (place.address?.road) confidence += 0.1;

	// Gebäude oder Einrichtung erhöht Konfidenz
	if (place.class === "building" || place.class === "amenity") confidence += 0.2;

	// Typ-spezifische Bewertung
	if (place.class === "highway" && place.type === "residential") confidence += 0.1;
	if (place.class === "place" && place.type === "city") confidence += 0.1;

	return Math.min(confidence, 1.0);
};

// Score-Berechnung für bessere Sortierung
const calculateScore = (place: NominatimPlace): number => {
	let score = 0;

	// Präzisions-basierte Punkte
	const precisionScores: Record<string, number> = {
		submeter: 100,
		meter: 80,
		street: 60,
		city: 40,
		region: 20,
	};

	const precision = determinePrecision(place);
	if (precision) {
		score += precisionScores[precision] || 0;
	}

	// Zusätzliche Punkte für Details
	if (place.address?.house_number) score += 20;
	if (place.address?.postcode) score += 15;
	if (place.address?.road) score += 10;
	if (place.class === "building") score += 15;
	if (place.class === "amenity") score += 10;

	return score;
};

// Ergebnisse sortieren und filtern
const processResults = (results: EnhancedPlace[]): EnhancedPlace[] => {
	// Nach Score und Konfidenz sortieren
	return results
		.sort((a, b) => {
			const aScore = (a.score || 0) + (a.confidence || 0) * 10;
			const bScore = (b.score || 0) + (b.confidence || 0) * 10;
			return bScore - aScore;
		})
		.slice(0, 8); // Top 8 Ergebnisse
};

export function AddressAutocomplete({
	placeholder = "Adresse eingeben...",
	value = "",
	onSelect,
	onClear,
	className,
	autoFocus = false,
}: AddressAutocompleteProps) {
	const [query, setQuery] = useState(value);
	const [suggestions, setSuggestions] = useState<EnhancedPlace[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [debouncedQuery] = useDebounce(query, 300);

	// Erweiterte Nominatim-Suche
	useEffect(() => {
		if (debouncedQuery.length < 3) {
			setSuggestions([]);
			return;
		}

		const searchAddresses = async () => {
			setIsLoading(true);
			try {
				const results = await searchNominatimEnhanced(debouncedQuery);
				const processedResults = processResults(results);
				setSuggestions(processedResults);
				setShowSuggestions(true);
			} catch (error) {
				console.error("Enhanced geocoding error:", error);
				setSuggestions([]);
			} finally {
				setIsLoading(false);
			}
		};

		searchAddresses();
	}, [debouncedQuery]);

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = useCallback(
		(place: EnhancedPlace) => {
			const address = formatAddress(place);
			const coordinates = getCoordinates(place);

			setQuery(address);
			setShowSuggestions(false);
			onSelect(address, coordinates, place.precision);
		},
		[onSelect],
	);

	const handleClear = useCallback(() => {
		setQuery("");
		setSuggestions([]);
		setShowSuggestions(false);
		onClear?.();
		inputRef.current?.focus();
	}, [onClear]);

	const getPrecisionIcon = (precision?: string) => {
		switch (precision) {
			case "submeter":
				return "🔍";
			case "meter":
				return "📍";
			case "street":
				return "🏠";
			case "city":
				return "🏙️";
			default:
				return "🌍";
		}
	};

	const getPrecisionText = (precision?: string) => {
		switch (precision) {
			case "submeter":
				return "Submeter-Genauigkeit";
			case "meter":
				return "Meter-Genauigkeit";
			case "street":
				return "Straßen-Genauigkeit";
			case "city":
				return "Stadt-Genauigkeit";
			default:
				return "Regions-Genauigkeit";
		}
	};

	const getConfidenceColor = (confidence?: number) => {
		if (!confidence) return "text-gray-400";
		if (confidence >= 0.8) return "text-green-600 dark:text-green-400";
		if (confidence >= 0.6) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	return (
		<div ref={containerRef} className={cn("relative group", className)}>
			<div className="relative">
				<MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
					placeholder={placeholder}
					className="peer h-14 pl-10 pr-10 rounded-xl border-2 border-transparent hover:border-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
					autoFocus={autoFocus}
				/>
				{isLoading && (
					<Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-500" />
				)}
				{query && !isLoading && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleClear}
						className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			<AnimatePresence>
				{showSuggestions && suggestions.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute top-full z-50 w-full mt-2"
					>
						<Command className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
							<CommandList className="max-h-80">
								{suggestions.map((place, index) => (
									<CommandItem
										key={`${place.place_id}-${index}`}
										onSelect={() => handleSelect(place)}
										className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
									>
										<div className="flex items-center gap-2 flex-1">
											<MapPin className="h-4 w-4 text-blue-500 shrink-0" />
											<div className="flex-1 min-w-0">
												<div className="font-medium text-gray-900 dark:text-gray-100 truncate">
													{formatAddress(place)}
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
													<span>Nominatim</span>
													<span>•</span>
													<span className={getConfidenceColor(place.confidence)}>
														{Math.round((place.confidence || 0) * 100)}% Konfidenz
													</span>
													{place.address?.house_number && (
														<>
															<span>•</span>
															<span>Hausnummer verfügbar</span>
														</>
													)}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
											<span>{getPrecisionIcon(place.precision)}</span>
											<span className="hidden sm:inline">{getPrecisionText(place.precision)}</span>
										</div>
									</CommandItem>
								))}
							</CommandList>
						</Command>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
