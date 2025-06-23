import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

interface Step2SelectionProps {
  selectedTargets: string[];
  onTargetToggle: (target: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const POLIZEIREVIERE = [
  'Stuttgart-Mitte',
  'Stuttgart-Bad Cannstatt', 
  'Karlsruhe-Mitte',
  'Mannheim-Innenstadt',
  'Freiburg-Mitte',
  'Heidelberg-Altstadt',
  'Ulm-Mitte',
  'Tübingen-Mitte'
];

export function Step2Selection({ 
  selectedTargets, 
  onTargetToggle, 
  onBack, 
  onNext 
}: Step2SelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Polizeireviere</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Wählen Sie Ihre Ziele ({selectedTargets.length} ausgewählt)
              </p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {POLIZEIREVIERE.map((revier) => (
              <motion.div
                key={revier}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedTargets.includes(revier) ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => onTargetToggle(revier)}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{revier}</div>
                    <div className="text-sm opacity-70">Polizeirevier</div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
            <Button 
              onClick={onNext}
              disabled={selectedTargets.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Berechnen
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 