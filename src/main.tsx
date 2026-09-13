import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Styles first, components second. CSS of equal specificity is resolved by
// source order, so loading base after the components lets a base rule override
// a component's — which is how .btn was beating .nav__cta on mobile.
import "./styles/tokens.css";
import "./styles/base.css";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("no #root element to mount into");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
