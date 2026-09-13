import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, MotionConfig } from "motion/react";
import "./styles/tokens.css";
import "./styles/base.css";
import { MethodPage } from "./components/method/MethodPage";

const loadMotion = () => import("./motionFeatures").then((mod) => mod.default);

const container = document.getElementById("root");
if (!container) throw new Error("no #root element to mount into");

createRoot(container).render(
  <StrictMode>
    <LazyMotion features={loadMotion} strict>
      <MotionConfig reducedMotion="user">
        <MethodPage />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
);
