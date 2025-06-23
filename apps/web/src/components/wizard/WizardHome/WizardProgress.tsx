import { MapPin, Shield, Route, Check } from "lucide-react";
import { motion } from "framer-motion";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  {
    id: 1,
    title: "Startadresse",
    description: "Wo starten Sie?",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Zielauswahl",
    description: "Welche Reviere interessieren Sie?",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Ergebnisse",
    description: "Ihre optimalen Routen",
    icon: <Route className="h-5 w-5" />
  }
];

interface WizardProgressProps {
  currentStep: number;
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.id 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500'
            }`}>
              {currentStep > step.id ? (
                <Check className="h-6 w-6" />
              ) : (
                step.icon
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {steps[currentStep - 1].title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
} 