import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/router";

import Shell from "./app/layout";
import AboutPage from "./app/about.page";
import "./index.css";

const router = createRouter({
	routeTree: {
		component: Shell,
		children: [
			{
				path: "/",
				component: () => <div>Home Page</div>,
			},
			{
				path: "/about",
				component: AboutPage,
			},
		],
	},
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
