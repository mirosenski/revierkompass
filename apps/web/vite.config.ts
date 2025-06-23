import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

// Universeller CommonJS ES6-Export Fix Plugin
const commonJSFixPlugin = () => {
	// Bekannte problematische Module
	const knownProblematicModules = [
		'concaveman', 'rbush', 'earcut', 'geojson-rbush', 'deep-equal',
		'density-clustering', 'martinez-polygon-clipping', 'quickselect', 
		'robust-predicates', 'tinyqueue', 'geojson-equality', 'skmeans'
	];
	
	return {
		name: 'universal-commonjs-fix',
		resolveId(id: string) {
			// Prüfe bekannte problematische Module
			if (knownProblematicModules.includes(id)) {
				return `${id}-fixed`;
			}
		},
		load(id: string) {
			if (id.endsWith('-fixed')) {
				const moduleName = id.replace('-fixed', '');
				return `
					// Universal CommonJS ES6-Export Fix für ${moduleName}
					let moduleExport;
					
					try {
						const importedModule = require('${moduleName}');
						
						// Universelle Export-Erkennung
						if (typeof importedModule === 'function') {
							// Direkte Funktion als Export
							moduleExport = importedModule;
						} else if (typeof importedModule === 'object' && importedModule !== null) {
							// Objekt mit möglichen Export-Mustern
							if (typeof importedModule.default === 'function') {
								moduleExport = importedModule.default;
							} else if (typeof importedModule[${JSON.stringify(moduleName)}] === 'function') {
								moduleExport = importedModule[${JSON.stringify(moduleName)}];
							} else if (typeof importedModule.module === 'function') {
								moduleExport = importedModule.module;
							} else if (typeof importedModule.main === 'function') {
								moduleExport = importedModule.main;
							} else {
								// Nimm das erste verfügbare Export als Fallback
								const keys = Object.keys(importedModule);
								const firstFunction = keys.find(key => typeof importedModule[key] === 'function');
								if (firstFunction) {
									moduleExport = importedModule[firstFunction];
								} else {
									// Wenn keine Funktion gefunden wird, exportiere das gesamte Objekt
									moduleExport = importedModule;
								}
							}
						} else {
							// Primitiver Export
							moduleExport = importedModule;
						}
					} catch (error) {
						console.error('Fehler beim Laden von ${moduleName}:', error);
						// Fallback: leere Funktion
						moduleExport = () => console.warn('${moduleName} konnte nicht geladen werden');
					}
					
					export default moduleExport;
				`;
			}
		}
	};
};

export default defineConfig({
	plugins: [
		react(),
		
		// CommonJS ES6-Export Fix
		commonJSFixPlugin(),
		
		// PWA Plugin mit optimierter Strategie
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
			manifest: {
				name: 'RevierKompass',
				short_name: 'RevierKompass',
				theme_color: '#3b82f6',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				// Hybrid Caching Strategy
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'osm-tiles-cache',
							expiration: {
								maxEntries: 500,
								maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/router\.project-osrm\.org\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'routing-cache',
							networkTimeoutSeconds: 3,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 // 24 hours
							}
						}
					},
					{
						urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'geocoding-cache',
							networkTimeoutSeconds: 3,
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
							}
						}
					}
				]
			}
		}),
		
		// Compression Plugin
		compression({
			algorithms: ['gzip'],
			exclude: [/\.(br)$/, /\.(gz)$/],
		}),
		compression({
			algorithms: ['brotliCompress'],
			exclude: [/\.(br)$/, /\.(gz)$/],
		}),
	],
	server: {
		port: 5173,
		strictPort: true,
		host: true,
		headers: {
			// Security Headers
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			// Basic CSP
			'Content-Security-Policy': [
				"default-src 'self'",
				"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
				"style-src 'self' 'unsafe-inline'",
				"img-src 'self' data: https://*.openstreetmap.org",
				"connect-src 'self' https://*.openstreetmap.org https://router.project-osrm.org https://nominatim.openstreetmap.org",
				"font-src 'self'",
				"worker-src 'self' blob:",
				"manifest-src 'self'"
			].join('; ')
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@revierkompass/ui": path.resolve(__dirname, "../../packages/ui/src"),
			'object-assign': 'object-assign',
		},
		// Behebe concaveman Export-Problem
		mainFields: ['module', 'main'],
	},
	build: {
		target: 'es2020',
		minify: 'terser',
		commonjsOptions: {
			include: [/node_modules/],  // Bessere CommonJS-Unterstützung
			transformMixedEsModules: true,
			dynamicRequireTargets: ['node_modules/**/*.js'],  // Erweiterte CommonJS-Unterstützung
			ignoreDynamicRequires: false
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug'],
			},
		},
		rollupOptions: {
			// Explizite Tree Shaking-Konfiguration
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
				unknownGlobalSideEffects: false,
			},
			output: {
				// Manual Chunks für besseres Code Splitting
				manualChunks: {
					'vendor': ['react', 'react-dom'],
					'router': ['@tanstack/react-router'],
					'map-core': ['maplibre-gl'],
					'ui-kit': ['@radix-ui/react-slot', 'lucide-react', 'framer-motion'],
					'state': ['zustand'],
					'routing': ['@turf/turf'],
					'query': ['@tanstack/react-query'],
				},
				// Asset-Optimierung
				assetFileNames: (assetInfo) => {
					const fileName = assetInfo.name || 'asset';
					let extType = fileName.split('.').at(1);
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
						extType = 'img';
					}
					return `assets/${extType || 'misc'}/[name]-[hash][extname]`;
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
			// CommonJS-Module werden jetzt durch das Plugin behandelt
		},
		// Performance Optimierungen
		cssCodeSplit: true,
		sourcemap: true, // Für source-map-explorer
		reportCompressedSize: false,
		chunkSizeWarningLimit: 1000,
	},
	// Dependency-Optimierung
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'@tanstack/react-router',
			'@tanstack/react-query',
			'zustand',
			'framer-motion',
			'lucide-react',
			// CommonJS-Module für bessere Unterstützung
			'concaveman', 'rbush', 'earcut', 'geojson-rbush', 'deep-equal',
			'density-clustering', 'quickselect', 'robust-predicates',
			'tinyqueue', 'geojson-equality', 'skmeans'
		],
		exclude: [
			'@turf/turf', // Wird dynamisch geladen
		],
	},
	define: {
		// Behebe concaveman global-Problem
		global: 'globalThis',
	},
});
