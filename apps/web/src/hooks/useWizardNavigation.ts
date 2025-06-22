import { useNavigate } from "react-router-dom";
import { useWizardStore, selectCanProceedToStep2, selectCanProceedToStep3 } from "../stores/wizard";
import { useCallback } from "react";

const stepRoutes = {
	1: "/",
	2: "/step-2",
	3: "/result",
} as const;

export function useWizardNavigation() {
	const navigate = useNavigate();
	const { currentStep, nextStep, previousStep, goToStep } = useWizardStore();

	const canProceedToStep2 = useWizardStore(selectCanProceedToStep2);
	const canProceedToStep3 = useWizardStore(selectCanProceedToStep3);

	const navigateToStep = useCallback(
		(step: number) => {
			goToStep(step);
			navigate(stepRoutes[step as keyof typeof stepRoutes]);
		},
		[goToStep, navigate],
	);

	const handleNext = useCallback(() => {
		if (currentStep === 1 && !canProceedToStep2) {
			console.warn("Cannot proceed to step 2: No Präsidium selected");
			return;
		}

		if (currentStep === 2 && !canProceedToStep3) {
			console.warn("Cannot proceed to step 3: No Reviere selected");
			return;
		}

		nextStep();
		const nextStepNumber = Math.min(currentStep + 1, 3) as keyof typeof stepRoutes;
		navigate(stepRoutes[nextStepNumber]);
	}, [currentStep, canProceedToStep2, canProceedToStep3, nextStep, navigate]);

	const handlePrevious = useCallback(() => {
		previousStep();
		const prevStepNumber = Math.max(currentStep - 1, 1) as keyof typeof stepRoutes;
		navigate(stepRoutes[prevStepNumber]);
	}, [currentStep, previousStep, navigate]);

	const canGoNext = useCallback(() => {
		switch (currentStep) {
			case 1:
				return canProceedToStep2;
			case 2:
				return canProceedToStep3;
			case 3:
				return false;
			default:
				return false;
		}
	}, [currentStep, canProceedToStep2, canProceedToStep3]);

	const canGoPrevious = currentStep > 1;

	return {
		currentStep,
		navigateToStep,
		handleNext,
		handlePrevious,
		canGoNext: canGoNext(),
		canGoPrevious,
	};
}
