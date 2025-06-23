import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Step1AddressProps {
  startAddress: string;
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  onNext: () => void;
}

export function Step1Address({ startAddress, onAddressSelect, onNext }: Step1AddressProps) {
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ihre Startadresse</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Geben Sie Ihre Adresse ein
              </p>
            </div>
          </div>
          
          <AddressAutocomplete
            value={startAddress}
            onSelect={onAddressSelect}
            placeholder="Straße, Hausnummer, PLZ, Stadt"
          />
          
          <Button 
            onClick={onNext}
            disabled={!startAddress}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Weiter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 