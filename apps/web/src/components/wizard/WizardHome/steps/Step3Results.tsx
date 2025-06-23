import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Route, Clock, Download, Copy, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Result {
  id: string;
  name: string;
  distance: number;
  duration: number;
}

interface Step3ResultsProps {
  results: Result[];
  loading: boolean;
  onNewSearch: () => void;
}

export function Step3Results({ results, loading, onNewSearch }: Step3ResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = results.map((r, i) => 
      `${i + 1}. ${r.name}\n   ${r.distance.toFixed(1)} km - ${r.duration} min`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    // Excel Export Logic
    console.log("Export to Excel");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Export Buttons */}
      <Card className="p-4 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1"
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Kopiert!' : 'Kopieren'}
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-3">
        {loading ? (
          <Card className="p-8 text-center backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Berechne optimale Routen...
            </p>
          </Card>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl font-bold text-blue-600 mr-3">
                        {index + 1}.
                      </span>
                      <h3 className="font-semibold">{result.name}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-blue-600">
                        <Route className="h-4 w-4 mr-1" />
                        {result.distance.toFixed(1)} km
                      </span>
                      <span className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {result.duration} min
                      </span>
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-8 text-center backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
            <p className="text-gray-600 dark:text-gray-400">
              Keine Ergebnisse verfügbar
            </p>
          </Card>
        )}
      </div>

      <Button 
        variant="outline"
        onClick={onNewSearch}
        className="w-full"
      >
        Neue Suche starten
      </Button>
    </motion.div>
  );
} 