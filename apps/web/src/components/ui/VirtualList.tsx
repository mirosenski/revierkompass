import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface VirtualListProps<T> {
	items: T[];
	itemHeight: number;
	containerHeight: number;
	renderItem: (item: T, index: number) => ReactNode;
	overscan?: number;
	className?: string;
	onScroll?: (scrollTop: number) => void;
	getKey: (item: T) => string | number;
}

export function VirtualList<T>({
	items,
	itemHeight,
	containerHeight,
	renderItem,
	overscan = 3,
	className,
	onScroll,
	getKey,
}: VirtualListProps<T>) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [scrollTop, setScrollTop] = useState(0);

	// Calculate visible range
	const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
	const endIndex = Math.min(
		items.length - 1,
		Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
	);

	const visibleItems = items.slice(startIndex, endIndex + 1);
	const totalHeight = items.length * itemHeight;
	const offsetY = startIndex * itemHeight;

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const newScrollTop = e.currentTarget.scrollTop;
			setScrollTop(newScrollTop);
			onScroll?.(newScrollTop);
		},
		[onScroll],
	);

	// Scroll to item
	const scrollToIndex = useCallback(
		(index: number, behavior: ScrollBehavior = "smooth") => {
			const container = scrollContainerRef.current;
			if (!container) return;

			const targetScrollTop = index * itemHeight;
			container.scrollTo({
				top: targetScrollTop,
				behavior,
			});
		},
		[itemHeight],
	);

	// Expose scrollToIndex via ref
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			(container as HTMLDivElement & { scrollToIndex: typeof scrollToIndex }).scrollToIndex =
				scrollToIndex;
		}
	}, [scrollToIndex]);

	return (
		<div
			ref={scrollContainerRef}
			className={cn("overflow-auto", className)}
			style={{ height: containerHeight }}
			onScroll={handleScroll}
		>
			<div style={{ height: totalHeight, position: "relative" }}>
				<div
					style={{
						transform: `translateY(${offsetY}px)`,
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
					}}
				>
					{visibleItems.map((item, index) => {
						return (
							<div
								key={getKey(item)}
								style={{
									height: itemHeight,
									position: "absolute",
									top: index * itemHeight,
									width: "100%",
								}}
							>
								{renderItem(item, startIndex + index)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

// Hook for using VirtualList with search/filter
export function useVirtualListSearch<T>(items: T[], searchFn: (item: T, query: string) => boolean) {
	const [query, setQuery] = useState("");
	const [filteredItems, setFilteredItems] = useState(items);
	const [highlightIndex, setHighlightIndex] = useState(-1);

	useEffect(() => {
		if (!query) {
			setFilteredItems(items);
			setHighlightIndex(-1);
			return;
		}

		const filtered = items.filter((item) => searchFn(item, query));
		setFilteredItems(filtered);

		// Highlight first match
		if (filtered.length > 0) {
			const firstMatchIndex = items.findIndex((item) => searchFn(item, query));
			setHighlightIndex(firstMatchIndex);
		} else {
			setHighlightIndex(-1);
		}
	}, [items, query, searchFn]);

	return {
		query,
		setQuery,
		filteredItems,
		highlightIndex,
	};
}
