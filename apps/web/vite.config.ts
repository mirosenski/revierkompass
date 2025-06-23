import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
	plugins: [
		react(),
		
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
			transformMixedEsModules: true,
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
			// Behebe concaveman Export-Problem
			external: ['concaveman'],
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
