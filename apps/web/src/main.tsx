import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter, createRoute, createRootRoute } from "@tanstack/react-router";

import Shell from "./app/layout.tsx";
import AboutPage from "./app/about.page.tsx";
import "./index.css";

const rootRoute = createRootRoute({
	component: Shell,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <div>Home Page</div>,
});

const aboutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/about",
	component: AboutPage,
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
