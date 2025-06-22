import type React from "react";
import { useEffect, useState } from "react";

interface PerformanceMetrics {
	renderTime: number;
	visibleItems: number;
	totalItems: number;
	scrollEvents: number;
	memoryUsage?: number;
}

interface VirtualListPerformanceProps {
	showMetrics?: boolean;
}

export const VirtualListPerformance: React.FC<VirtualListPerformanceProps> = ({
	showMetrics = false,
}) => {
	const [metrics, setMetrics] = useState<PerformanceMetrics>({
		renderTime: 0,
		visibleItems: 0,
		totalItems: 0,
		scrollEvents: 0,
	});

	useEffect(() => {
		// Performance Observer für Render-Zeiten
		if ("PerformanceObserver" in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					if (entry.entryType === "measure") {
						setMetrics((prev) => ({
							...prev,
							renderTime: entry.duration,
						}));
					}
				});
			});

			observer.observe({ entryTypes: ["measure"] });

			return () => observer.disconnect();
		}
	}, []);

	if (!showMetrics) {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
			<div className="space-y-1">
				<div>Render: {metrics.renderTime.toFixed(2)}ms</div>
				<div>
					Visible: {metrics.visibleItems}/{metrics.totalItems}
				</div>
				<div>Scroll Events: {metrics.scrollEvents}</div>
				{metrics.memoryUsage && <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>}
			</div>
		</div>
	);
};

// Hook für Performance-Monitoring
export function useVirtualListPerformance() {
	const [isMonitoring, setIsMonitoring] = useState(false);
	const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);

	const startMonitoring = () => {
		setIsMonitoring(true);
		setPerformanceData([]);
	};

	const stopMonitoring = () => {
		setIsMonitoring(false);
	};

	const addPerformanceData = (metrics: PerformanceMetrics) => {
		if (isMonitoring) {
			setPerformanceData((prev) => [...prev, { ...metrics, timestamp: Date.now() }]);
		}
	};

	const getAverageRenderTime = () => {
		if (performanceData.length === 0) return 0;
		const total = performanceData.reduce((sum, data) => sum + data.renderTime, 0);
		return total / performanceData.length;
	};

	const getPerformanceReport = () => {
		if (performanceData.length === 0) return null;

		const avgRenderTime = getAverageRenderTime();
		const maxRenderTime = Math.max(...performanceData.map((d) => d.renderTime));
		const minRenderTime = Math.min(...performanceData.map((d) => d.renderTime));
		const totalScrollEvents = performanceData.reduce((sum, d) => sum + d.scrollEvents, 0);

		return {
			samples: performanceData.length,
			averageRenderTime: avgRenderTime,
			maxRenderTime,
			minRenderTime,
			totalScrollEvents,
			averageMemoryUsage:
				performanceData
					.filter((d) => d.memoryUsage)
					.reduce((sum, d) => sum + (d.memoryUsage || 0), 0) / performanceData.length,
		};
	};

	return {
		isMonitoring,
		startMonitoring,
		stopMonitoring,
		addPerformanceData,
		getAverageRenderTime,
		getPerformanceReport,
		performanceData,
	};
}
