import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter, createRoute, createRootRouteWithContext } from "@tanstack/react-router";

import Shell from "./app/layout.tsx";
import HomePage from "./app/home.page.tsx";
import AboutPage from "./app/about.page.tsx";
import "./index.css";

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

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

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
		<RouterProvider router={router} />
	</StrictMode>,
);
