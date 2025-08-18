import React from "react";
import Spline from "@splinetool/react-spline";

// Spline Robot Component with overlays
// SplineRobot.jsx (replace your return or add the wrapper)
export default function SplineRobot() {
  return (
    <div className="spline-wrapper" aria-hidden>
      <div className="spline-stage">            {/* NEW: stage we transform/shift */}
        <div className="spline-inner">
          <Spline scene="https://prod.spline.design/IcNORG5QRmYmORSV/scene.splinecode" />
        </div>
      </div>
      <div className="spline-badge-cover" aria-hidden />
      <div className="spline-dimmer" aria-hidden />
    </div>
  );
}
