import React from "react";
import Spline from "@splinetool/react-spline";

// Original Spline Component (unchanged)
// Spline Cube Component (Mock for demo)
export default function SplineCube() {
  return (
    <div className="spline-wrapper" aria-hidden>
      <div className="spline-inner">
        {/* Mock 3D cube since we can't use actual Spline in this environment */}
        <Spline scene="https://prod.spline.design/GDBDKt-khBcaVtJ9/scene.splinecode" />
      </div>
      <div className="spline-badge-cover" aria-hidden />
      <div className="spline-dimmer" aria-hidden />
    </div>
  );
}

