import React from "react";
import Navbar from "./components/Navbar";
import LeftHero from "./components/LeftHero";
import SplineRobot from "./components/SplineRobot";
import VideoCube from "./components/VideoCube";
import AboutUs from "./components/AboutUs";
import Projects from "./components/Projects";
import MakeSkill from "./components/MakeSkill";
import Experience from "./components/Experience";
import "./App.css";

import Lenis from "@studio-freight/lenis";
import Contact from "./components/contact";

function useIsDesktop(threshold = 1100) {
  const isWindow = typeof window !== "undefined";
  const [isDesktop, setIsDesktop] = React.useState(isWindow ? window.innerWidth > threshold : true);

  React.useEffect(() => {
    if (!isWindow) return;
    
    let rafId = null;
    
    function check() {
      const next = window.innerWidth > threshold;
      setIsDesktop(next);
    }
    
    function onResize() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    }
    
    window.addEventListener("resize", onResize);
    check();
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [threshold, isWindow]);

  return isDesktop;
}

export default function App() {
  const isDesktop = useIsDesktop(1100);
  const lenisRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Clean up any existing instances
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // Create single Lenis instance
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.8,
      normalizeWheel: true,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Make it globally accessible for Navbar
    window.lenis = lenis;
    window.lenisInstance = lenis;

    // Animation frame loop for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      window.lenis = null;
      window.lenisInstance = null;
    };
  }, []);

  return (
    <div className="app-root">
      <Navbar />

      {/* HOME SECTION - Fixed positioning */}
      <section 
        id="home" 
        className="hero-container" 
        role="main"
        style={{ 
          minHeight: '100vh',
          paddingTop: '72px', // Account for fixed navbar
          scrollMarginTop: '0px' // No offset needed for home
        }}
      >
        <div className="hero-left">
          <div className="cube-background" aria-hidden="true">
            <VideoCube />
          </div>

          <div className="hero-content">
            <LeftHero />
          </div>
        </div>

        {isDesktop && (
          <aside className="hero-right" aria-hidden="false">
            <SplineRobot />
          </aside>
        )}
      </section>
      
      {/* ABOUT SECTION - Fixed positioning */}
      <section 
        id="about" 
        style={{ 
          minHeight: '100vh',
          paddingTop: '72px', // Account for fixed navbar
          scrollMarginTop: '72px', // Offset for navbar
          marginTop: '-72px' // Pull up to eliminate gap
        }}
      >
        <AboutUs highlights={['SaiprasadJamdar','VibeCoding','CoolProjects','DSA','Gamethon2k25','FYTopper','awesome.',':)']} />
      </section>

      {/* PROJECTS SECTION - Interactive Slideshow */}
      <section id="projects" style={{ scrollMarginTop: '0px', background: 'linear-gradient(180deg,#000 0%,#0a0a0a 100%)' }}>
        <Projects />
      </section>

      {/* SKILLS SECTION - horizontal infinite marquee */}
      <section id="skills" aria-label="Skills" style={{ scrollMarginTop: '72px' }}>
        <MakeSkill />
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" >
        <Experience />
      </section>

      {/* CONTACT SECTION */}
      <section id="contact">
        <Contact/> 
      </section>
    </div>
  );
}
