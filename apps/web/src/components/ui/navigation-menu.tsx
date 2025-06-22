import type * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

// Navigation Menu Root - Container für das gesamte Navigation Menu
function NavigationMenu({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="navigation-menu"
			className={cn("relative", className)}
			{...props}
		>
			{children}
		</div>
	);
}

// Navigation Menu List - Container für Menu Items
function NavigationMenuList({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="navigation-menu-list"
			className={cn("flex items-center gap-1", className)}
			{...props}
		>
			{children}
		</div>
	);
}

// Navigation Menu Item - Container für einzelne Menu Items
function NavigationMenuItem({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		>
			{children}
		</div>
	);
}

// Navigation Menu Trigger - Button der das Dropdown öffnet
const navigationMenuTriggerStyle = cva(
	"group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
);

function NavigationMenuTrigger({
	className,
	children,
	onClick,
	...props
}: React.ComponentProps<"button">) {
	return (
		<button
			data-slot="navigation-menu-trigger"
			className={cn(navigationMenuTriggerStyle(), "group", className)}
			onClick={onClick}
			{...props}
		>
			{children}{" "}
			<ChevronDownIcon
				className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			/>
		</button>
	);
}

// Navigation Menu Content - Dropdown Inhalt
function NavigationMenuContent({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="navigation-menu-content"
			className={cn(
				"absolute top-full right-0 mt-2 bg-popover text-popover-foreground rounded-md border shadow-md z-50",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

// Navigation Menu Link - Links innerhalb des Dropdowns
function NavigationMenuLink({
	className,
	children,
	...props
}: React.ComponentProps<"a">) {
	return (
		<a
			data-slot="navigation-menu-link"
			className={cn(
				"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		>
			{children}
		</a>
	);
}

// Navigation Menu Viewport - Container für das Dropdown (nicht mehr benötigt, aber für Kompatibilität)
function NavigationMenuViewport({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="navigation-menu-viewport"
			className={cn("", className)}
			{...props}
		/>
	);
}

// Navigation Menu Indicator - Indicator für aktive Items (nicht mehr benötigt, aber für Kompatibilität)
function NavigationMenuIndicator({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="navigation-menu-indicator"
			className={cn("", className)}
			{...props}
		/>
	);
}

// Hover Navigation Menu - Erweiterte Version mit Hover-Funktionalität
interface HoverNavigationMenuProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

function HoverNavigationMenu({ trigger, children, className }: HoverNavigationMenuProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Hover handlers mit Delay
	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setDropdownOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setDropdownOpen(false);
		}, 150); // 150ms Delay bevor sich das Dropdown schließt
	};

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<div
			className={cn("relative", className)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			ref={dropdownRef}
		>
			{/* Trigger mit data-state für Chevron Animation */}
			<div data-state={dropdownOpen ? "open" : "closed"}>
				{trigger}
			</div>
			
			{/* Dropdown Content */}
			{dropdownOpen && (
				<div
					className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{children}
				</div>
			)}
		</div>
	);
}

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationMenuViewport,
	HoverNavigationMenu,
	navigationMenuTriggerStyle,
};
