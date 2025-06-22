import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useWizardNavigation } from "../../hooks/useWizardNavigation";

export function WizardControls() {
	const { currentStep, handleNext, handlePrevious, canGoNext, canGoPrevious } =
		useWizardNavigation();

	const getNextButtonText = () => {
		switch (currentStep) {
			case 1:
				return "Präsidium auswählen";
			case 2:
				return "Ergebnisse anzeigen";
			case 3:
				return "Fertig";
			default:
				return "Weiter";
		}
	};

	return (
		<div className="flex justify-between items-center">
			<Button
				variant="outline"
				onClick={handlePrevious}
				disabled={!canGoPrevious}
				className="gap-2"
			>
				<ArrowLeft className="h-4 w-4" />
				Zurück
			</Button>

			<div className="flex gap-2">
				{[1, 2, 3].map((step) => (
					<div
						key={step}
						className={`h-2 w-8 rounded-full transition-colors ${
							step === currentStep
								? "bg-primary"
								: step < currentStep
									? "bg-primary/50"
									: "bg-muted"
						}`}
					/>
				))}
			</div>

			<Button onClick={handleNext} disabled={!canGoNext} className="gap-2">
				{getNextButtonText()}
				{currentStep < 3 && <ArrowRight className="h-4 w-4" />}
			</Button>
		</div>
	);
}
