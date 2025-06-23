import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	RouterProvider,
	createRouter,
	createRoute,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Shell from "./app/layout.tsx";
import HomePage from "./app/home.page.tsx";
import AboutPage from "./app/about.page.tsx";
import WizardPage from "./app/wizard.page.tsx";
import PraesidienPage from "./app/praesidien.page.tsx";
import KartePage from "./app/karte.page.tsx";
import "./index.css";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 10, // 10 minutes
			retry: 1,
		},
	},
});

interface MyRouterContext {
	getTitle?: () => string;
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
	component: Shell,
	context: () => ({
		getTitle: () => "Start",
	}),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: HomePage,
	context: () => ({
		getTitle: () => "Start",
	}),
});

const aboutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/about",
	component: AboutPage,
	context: () => ({
		getTitle: () => "Über uns",
	}),
});

const wizardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/wizard",
	component: WizardPage,
	context: () => ({
		getTitle: () => "Route finden",
	}),
});

const praesidienRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/praesidien",
	component: PraesidienPage,
	context: () => ({
		getTitle: () => "Präsidien",
	}),
});

const karteRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/karte",
	component: KartePage,
	context: () => ({
		getTitle: () => "Kartenansicht",
	}),
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	aboutRoute,
	wizardRoute,
	praesidienRoute,
	karteRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
