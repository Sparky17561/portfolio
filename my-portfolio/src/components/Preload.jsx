// Preload.jsx
import React, { useEffect, useRef, useState } from 'react';


const Preload = ({ onComplete, videoCubeRef, splineRobotRef }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    leftHero: false,
    videoCube: false,
    splineRobot: false
  });
  const [error, setError] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const progressRef = useRef(0);
  const rafRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    try {
      timersRef.current.push(setTimeout(() => {
        setLoadingStates(s => ({ ...s, leftHero: true }));
      }, 400));

      timersRef.current.push(setTimeout(() => {
        try {
          setLoadingStates(s => ({ ...s, videoCube: true }));
        } catch (e) {
          console.error('videoCube load err', e);
          setLoadingStates(s => ({ ...s, videoCube: true }));
        }
      }, 1400));

      timersRef.current.push(setTimeout(() => {
        try {
          setLoadingStates(s => ({ ...s, splineRobot: true }));
        } catch (e) {
          console.error('spline load err', e);
          setLoadingStates(s => ({ ...s, splineRobot: true }));
        }
      }, 2400));

      timersRef.current.push(setTimeout(() => {
        console.warn('Preloader fallback triggered — forcing loaded states');
        setLoadingStates({ leftHero: true, videoCube: true, splineRobot: true });
      }, 9000));
    } catch (err) {
      console.error('Preloader init error', err);
      setError(err);
      setLoadingStates({ leftHero: true, videoCube: true, splineRobot: true });
    }

    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoCubeRef, splineRobotRef]);

  useEffect(() => {
    const { leftHero, videoCube, splineRobot } = loadingStates;
    let target = 0;
    if (leftHero) target += 33;
    if (videoCube) target += 33;
    if (splineRobot) target += 34;

    const step = () => {
      try {
        if (progressRef.current < target) {
          progressRef.current = Math.min(progressRef.current + 2, target);
          setProgress(progressRef.current);
          rafRef.current = requestAnimationFrame(step);
        } else {
          setProgress(progressRef.current);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }
      } catch (err) {
        console.error('Progress animation error', err);
        progressRef.current = target;
        setProgress(target);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);

    if (leftHero && videoCube && splineRobot && Math.round(target) >= 100) {
      const ensures = setTimeout(() => {
        progressRef.current = 100;
        setProgress(100);

        const fadeTimer = setTimeout(() => {
          setFadeOut(true);

          const finish = setTimeout(() => {
            if (typeof onComplete === 'function') onComplete();
          }, 700);
          timersRef.current.push(finish);
        }, 220);

        timersRef.current.push(fadeTimer);
      }, 300);

      timersRef.current.push(ensures);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [loadingStates, onComplete]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => {
        setError(null);
        if (typeof onComplete === 'function') onComplete();
      }, 1800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [error, onComplete]);

  if (error) {
    return (
      <div className="preloader-container error-state">
        <div className="preloader-background" />
        <div className="preloader-content">
          <div className="preloader-logo">
            {/* fallback text if error */}
            <div style={{ color: '#22c55e', fontSize: 36, fontWeight: 700 }}>Saiprasad Jamdar</div>
          </div>

          <div className="progress-section">
            <div className="error-message">Loading encountered an issue — continuing...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`preloader-container ${fadeOut ? 'fade-out' : ''}`} role="status" aria-live="polite">
      <div className="preloader-background" />

      <div className="preloader-content" aria-hidden={fadeOut}>
        <div className="preloader-logo">
          {/* Inline SVG logo — gradient fills glyphs only (foolproof) */}
          <svg
            className="logo-svg logo-shadow"
            viewBox="0 0 900 220"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Saiprasad Jamdar"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              <linearGradient id="g2" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* Optional subtle outer glow */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* First name */}
            <text
              x="50%"
              y="70"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 64,
                letterSpacing: 2,
                paintOrder: 'stroke fill markers'
              }}
              fill="url(#g1)"
            >
              <tspan>Saiprasad</tspan>
            </text>

            {/* Last name */}
            <text
              x="50%"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 64,
                letterSpacing: 2,
                paintOrder: 'stroke fill markers'
              }}
              fill="url(#g2)"
            >
              <tspan>Jamdar</tspan>
            </text>
          </svg>
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>

            <div className="progress-text" aria-hidden={fadeOut}>
              <span className="progress-percentage">{Math.min(Math.round(progress), 100)}%</span>
              <span className="progress-status">
                {progress < 33 ? 'Loading interface...' :
                 progress < 66 ? 'Loading animations...' :
                 progress < 100 ? 'Loading 3D models...' :
                 'Ready!'}
              </span>
            </div>
          </div>

          <div className="component-status" aria-hidden={fadeOut}>
            <div className={`status-item ${loadingStates.leftHero ? 'loaded' : ''}`}>
              <div className="status-dot" />
              <span>Interface</span>
            </div>
            <div className={`status-item ${loadingStates.videoCube ? 'loaded' : ''}`}>
              <div className="status-dot" />
              <span>Animations</span>
            </div>
            <div className={`status-item ${loadingStates.splineRobot ? 'loaded' : ''}`}>
              <div className="status-dot" />
              <span>3D Models</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preload;
