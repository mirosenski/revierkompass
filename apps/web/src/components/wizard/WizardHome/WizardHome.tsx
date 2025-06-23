import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MapView } from "@/components/ui/MapView";
import { AnimatePresence } from "framer-motion";
import { WizardProgress } from "./WizardProgress";
import { Step1Address, Step2Selection, Step3Results } from "./steps";

interface Result {
  id: string;
  name: string;
  distance: number;
  duration: number;
}

export function WizardHome() {
  const [currentStep, setCurrentStep] = useState(1);
  const [startAddress, setStartAddress] = useState("");
  const [startCoordinates, setStartCoordinates] = useState<[number, number] | undefined>();
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddressSelect = (address: string, coordinates: [number, number]) => {
    setStartAddress(address);
    setStartCoordinates(coordinates);
  };

  const handleTargetToggle = (target: string) => {
    setSelectedTargets(prev => 
      prev.includes(target) 
        ? prev.filter(t => t !== target)
        : [...prev, target]
    );
  };

  const handleNewSearch = () => {
    setCurrentStep(1);
    setStartAddress("");
    setStartCoordinates(undefined);
    setSelectedTargets([]);
    setResults([]);
  };

  // Mock results calculation
  useEffect(() => {
    if (currentStep === 3 && selectedTargets.length > 0) {
      setLoading(true);
      setTimeout(() => {
        const mockResults = selectedTargets.map((target, index) => ({
          id: target,
          name: target,
          distance: Math.random() * 50 + 5,
          duration: Math.round(Math.random() * 60 + 10)
        })).sort((a, b) => a.distance - b.distance);
        
        setResults(mockResults);
        setLoading(false);
      }, 2000);
    }
  }, [currentStep, selectedTargets]);

  // Mock destinations for demo
  const destinations = selectedTargets.map(target => ({
    id: target,
    name: target,
    coordinates: [9.1829, 48.7758] as [number, number], // Stuttgart coordinates
    address: `${target}, Stuttgart`
  }));

  return (
    <div id="modern-wizard" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Bar */}
        <WizardProgress currentStep={currentStep} />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <div
            key={currentStep}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column - Form/Results */}
            <div className="lg:col-span-1 space-y-6">
              {currentStep === 1 && (
                <Step1Address
                  startAddress={startAddress}
                  onAddressSelect={handleAddressSelect}
                  onNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <Step2Selection
                  selectedTargets={selectedTargets}
                  onTargetToggle={handleTargetToggle}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}

              {currentStep === 3 && (
                <Step3Results
                  results={results}
                  loading={loading}
                  onNewSearch={handleNewSearch}
                />
              )}
            </div>

            {/* Right Column - Map */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 overflow-hidden">
                <MapView 
                  startCoordinates={startCoordinates}
                  destinations={destinations}
                />
              </Card>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
} 