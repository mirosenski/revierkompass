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
import { useDebounce } from "../../hooks/useDebounce";
import { cn } from "../../lib/utils";

interface AddressAutocompleteProps {
	placeholder?: string;
	value?: string;
	onSelect: (address: string, coordinates: [number, number]) => void;
	onClear?: () => void;
	className?: string;
	autoFocus?: boolean;
}

export function AddressAutocomplete({
	placeholder = "Adresse eingeben...",
	value = "",
	onSelect,
	onClear,
	className,
	autoFocus = false,
}: AddressAutocompleteProps) {
	const [query, setQuery] = useState(value);
	const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const debouncedQuery = useDebounce(query, 300);

	// Search for addresses
	useEffect(() => {
		if (debouncedQuery.length < 3) {
			setSuggestions([]);
			return;
		}

		const searchAddresses = async () => {
			setIsLoading(true);
			try {
				const results = await searchAddress(debouncedQuery, {
					limit: 5,
					countrycodes: "de",
					addressdetails: true,
				});
				setSuggestions(results);
				setShowSuggestions(true);
			} catch (error) {
				console.error("Address search error:", error);
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
		(place: NominatimPlace) => {
			const address = formatAddress(place);
			const coordinates = getCoordinates(place);

			setQuery(address);
			setShowSuggestions(false);
			onSelect(address, coordinates);
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

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!showSuggestions || suggestions.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
					break;
				case "Enter":
					e.preventDefault();
					if (selectedIndex >= 0 && suggestions[selectedIndex]) {
						handleSelect(suggestions[selectedIndex]);
					}
					break;
				case "Escape":
					e.preventDefault();
					setShowSuggestions(false);
					break;
			}
		},
		[showSuggestions, suggestions, selectedIndex, handleSelect],
	);

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			<div className="relative">
				<MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
					placeholder={placeholder}
					className="pl-10 pr-10"
					autoFocus={autoFocus}
				/>
				{isLoading && (
					<Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
				)}
				{query && !isLoading && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleClear}
						className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			{showSuggestions && suggestions.length > 0 && (
				<div
					role="listbox"
					aria-label="Adressvorschläge"
					className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600"
				>
					{suggestions.map((place, index) => (
						<div
							key={`${place.place_id}-${index}`}
							id={`address-option-${index}`}
							role="option"
							tabIndex={-1}
							aria-selected={selectedIndex === index}
							onClick={() => handleSelect(place)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleSelect(place)
							}}
							onMouseEnter={() => setSelectedIndex(index)}
							className={`cursor-pointer px-4 py-2 ${
								selectedIndex === index
									? "bg-blue-600 text-white dark:bg-blue-400"
									: "hover:bg-gray-200 dark:hover:bg-gray-600"
							}`}
						>
							<div className="flex items-start gap-2">
								<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
								<div className="min-w-0 flex-1">
									<div className="font-medium">{formatAddress(place)}</div>
									{place.address && (
										<div className="text-xs text-muted-foreground">
											{place.class === "highway" && "Straße"}
											{place.class === "place" && "Ort"}
											{place.class === "building" && "Gebäude"}
											{place.class === "amenity" && "Einrichtung"}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
