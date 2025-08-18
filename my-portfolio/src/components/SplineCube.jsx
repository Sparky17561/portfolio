import React from "react";
import Spline from "@splinetool/react-spline";
import ErrorBoundary from "./ErrorBoundary";

export default function SplineCube() {
  const handleLoad = (spline) => {
    // optional
  };

  return (
    <ErrorBoundary>
      <div className="spline-wrapper" aria-hidden>
        <div className="spline-inner" role="img" aria-label="Animated cube">
          <Spline
            scene="https://prod.spline.design/GDBDKt-khBcaVtJ9/scene.splinecode"
            onLoad={handleLoad}
          />
        </div>
        <div className="spline-badge-cover" aria-hidden />
        <div className="spline-dimmer" aria-hidden />
      </div>
    </ErrorBoundary>
  );
}
