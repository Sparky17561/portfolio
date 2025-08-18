import React from "react";
import Navbar from "./components/Navbar";
import LeftHero from "./components/LeftHero";
import SplineRobot from "./components/SplineRobot";
import SplineCube from "./components/SplineCube";
import "./App.css";

function useIsDesktop(threshold = 1100) {
  const isWindow = typeof window !== "undefined";
  const [isDesktop, setIsDesktop] = React.useState(isWindow ? window.innerWidth > threshold : true);

  React.useEffect(() => {
    if (!isWindow) return;
    let raf = null;

    function check() {
      const next = window.innerWidth > threshold;
      setIsDesktop(next);
    }

    function onResize() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    }

    window.addEventListener("resize", onResize);
    check();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [threshold, isWindow]);

  return isDesktop;
}

export default function App() {
  const isDesktop = useIsDesktop(1100);

  return (
    <div className="app-root">
      <Navbar />

      <main className="hero-container" role="main">
        <section className="hero-left">
          <div className="cube-background" aria-hidden>
            {isDesktop && <SplineCube />}
          </div>

          <div className="hero-content">
            <LeftHero />
          </div>
        </section>

        {isDesktop ? (
          <aside className="hero-right" aria-hidden={false}>
            <SplineRobot />
          </aside>
        ) : null}
      </main>
    </div>
  );
}
