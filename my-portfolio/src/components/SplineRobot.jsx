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

        {/* Complete watermark coverage - expanded and repositioned */}
        <div 
          className="spline-watermark-complete" 
          aria-hidden 
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '120px',
            height: '45px',
            background: 'linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,1) 100%)',
            pointerEvents: 'none',
            zIndex: 10002,
            borderRadius: '8px 0 12px 0'
          }}
        />
        
        {/* Secondary coverage for any remaining bits */}
        <div 
          className="spline-watermark-secondary" 
          aria-hidden 
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '100px',
            height: '35px',
            background: 'rgba(0,0,0,0.98)',
            pointerEvents: 'none',
            zIndex: 10003,
            borderRadius: '6px'
          }}
        />
        
        {/* Extra edge coverage */}
        <div 
          className="spline-edge-complete" 
          aria-hidden 
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '140px',
            height: '60px',
            background: 'radial-gradient(ellipse at 95% 95%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.2) 60%, transparent 85%)',
            pointerEvents: 'none',
            zIndex: 10001,
            borderRadius: '0 12px 12px 0'
          }}
        />

        {/* Natural shadow base */}
        <div 
          className="spline-natural-base" 
          aria-hidden 
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '160px',
            height: '80px',
            background: 'radial-gradient(ellipse at 85% 85%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: 9999,
            borderRadius: '0 12px 12px 0',
            filter: 'blur(2px)'
          }}
        />
      </div>
    </ErrorBoundary>
  );
}