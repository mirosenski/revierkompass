import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		host: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@revierkompass/ui": path.resolve(__dirname, "../../packages/ui/src"),
		},
	},
});
