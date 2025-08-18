import React from "react";
import Spline from "@splinetool/react-spline";
import ErrorBoundary from "./ErrorBoundary";

export default function SplineRobot() {
  // You can pass onLoad to handle the spline instance if needed.
  const handleLoad = (spline) => {
    // optional interactions with spline scene (safe to be empty)
    // console.log("Spline robot loaded", spline);
  };

  return (
    <ErrorBoundary>
      <div className="spline-wrapper" aria-hidden>
        <div className="spline-stage">
          <div className="spline-inner" role="img" aria-label="Animated robot">
            {/* Use your robot scene url */}
            <Spline
              scene="https://prod.spline.design/IcNORG5QRmYmORSV/scene.splinecode"
              onLoad={handleLoad}
            />
          </div>
        </div>
        <div className="spline-badge-cover" aria-hidden />
        <div className="spline-dimmer" aria-hidden />
      </div>
    </ErrorBoundary>
  );
}
