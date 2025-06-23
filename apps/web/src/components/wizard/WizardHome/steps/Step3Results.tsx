import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Route, Clock, Download, Copy, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWizardStore } from "@/stores/wizard";
import { useExportRoutes, formatDistance, formatDuration } from "@/services/wizard";
import type { RouteResult } from "@/stores/wizard";

interface Step3ResultsProps {
  results: RouteResult[];
  loading: boolean;
}

export function Step3Results({ results, loading }: Step3ResultsProps) {
  const [copied, setCopied] = useState(false);
  const { reset } = useWizardStore();
  const exportMutation = useExportRoutes();

  const handleCopy = () => {
    const text = results.map((r, i) => 
      `${i + 1}. ${r.name}\n   ${formatDistance(r.distance)} - ${formatDuration(r.duration)}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    exportMutation.mutate(results);
  };

  const handleNewSearch = () => {
    reset();
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
            disabled={results.length === 0}
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Kopiert!' : 'Kopieren'}
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            disabled={results.length === 0 || exportMutation.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            {exportMutation.isPending ? 'Exportiere...' : 'Excel'}
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
                        {formatDistance(result.distance)}
                      </span>
                      <span className="flex items-center text-green-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(result.duration)}
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
        onClick={handleNewSearch}
        className="w-full"
      >
        Neue Suche starten
      </Button>
    </motion.div>
  );
} 