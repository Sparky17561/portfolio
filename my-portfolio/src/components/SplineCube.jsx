import React, { useState, useEffect, Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

const LazySpline = React.lazy(() => import("@splinetool/react-spline"));

function SplineCube() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay Spline load until after page is interactive
    const timer = setTimeout(() => setShouldLoad(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoad = (spline) => {
    // optional — can tweak camera/lighting here if needed
  };

  return (
    <ErrorBoundary>
      <div className="spline-wrapper" aria-hidden>
        {shouldLoad ? (
          <Suspense fallback={<div className="spline-loading">Loading...</div>}>
            <div className="spline-inner" role="img" aria-label="Animated cube">
              <LazySpline
                scene="https://prod.spline.design/IoSE-0K8TEbU417R/scene.splinecode"
                onLoad={handleLoad}
              />
            </div>
          </Suspense>
        ) : (
          <div className="spline-placeholder">✨</div>
        )}

        {/* overlays */}
        <div className="spline-watermark-blocker" aria-hidden />
        <div className="spline-center-blocker" aria-hidden />
        <div className="spline-dimmer" aria-hidden />
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(SplineCube);
