import React, { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

// Lazy load the Spline component
const LazySpline = React.lazy(() => import("@splinetool/react-spline"));

export default function SplineRobot() {
  const handleLoad = (spline) => {
    // Safe hook to interact with Spline scene
    // console.log("Robot spline loaded", spline);
  };

  return (
    <ErrorBoundary>
      <div className="spline-robot-wrapper" aria-hidden>
        <div className="spline-robot-stage">
          <div
            className="spline-robot-inner"
            role="img"
            aria-label="Animated 3D robot"
          >
            <Suspense fallback={<div className="spline-fallback">Loading…</div>}>
              <LazySpline
                scene="https://prod.spline.design/IcNORG5QRmYmORSV/scene.splinecode"
                onLoad={handleLoad}
              />
            </Suspense>
          </div>
        </div>

        {/* Overlays to block watermark & smooth visuals */}
        <div className="spline-watermark-blocker" aria-hidden />
        <div className="spline-center-blocker" aria-hidden />
        <div className="spline-dimmer" aria-hidden />
      </div>
    </ErrorBoundary>
  );
}