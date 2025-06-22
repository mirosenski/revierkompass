import type React from "react";
import type { Revier } from "../../stores/wizard";

interface RevierCardProps {
	revier: Revier;
	isSelected: boolean;
	onToggle: (revier: Revier) => void;
	isHighlighted?: boolean;
}

export const RevierCard: React.FC<RevierCardProps> = ({
	revier,
	isSelected,
	onToggle,
	isHighlighted = false,
}) => {
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onToggle(revier);
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => onToggle(revier)}
			onKeyDown={handleKeyDown}
			aria-pressed={isSelected}
			className={`p-4 border rounded-lg cursor-pointer transition-all ${
				isSelected
					? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
					: isHighlighted
						? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
						: "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center space-x-2">
						<div
							className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
								isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
							}`}
						>
							{isSelected && (
								<svg
									className="w-3 h-3 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<title>Ausgewählt</title>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</div>
						<h4 className="font-medium text-gray-900 dark:text-white">{revier.name}</h4>
					</div>

					{revier.contact && (
						<div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
							{revier.contact.address && (
								<div className="flex items-center space-x-1">
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<title>Adresse</title>
										<path
											fillRule="evenodd"
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clipRule="evenodd"
										/>
									</svg>
									<span>{revier.contact.address}</span>
								</div>
							)}
							{revier.contact.phone && (
								<div className="flex items-center space-x-1">
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<title>Telefon</title>
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
									<span>{revier.contact.phone}</span>
								</div>
							)}
							{revier.contact.email && (
								<div className="flex items-center space-x-1">
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<title>E-Mail</title>
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
									<span>{revier.contact.email}</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
