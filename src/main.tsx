import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";
import "./cinematic.css";
const root = document.getElementById("root")!;
const app = <App initialPath={location.pathname} />;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

import "./refinement.css";

import "./daylight.css";

import "./approved-chapter.css";

import "./straight-story.css";
