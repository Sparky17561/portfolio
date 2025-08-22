import React, { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LeftHero from "./components/LeftHero";
import SplineRobot from "./components/SplineRobot";
import VideoCube from "./components/VideoCube";
import AboutUs from "./components/AboutUs";
import Projects from "./components/Projects";
import MakeSkill from "./components/MakeSkill";
import Experience from "./components/Experience";
import ContactFooter from "./components/ContactFooter";
import Preload from "./components/Preload";
import "./App.css";

import Lenis from "@studio-freight/lenis";

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
  const rafRef = React.useRef(null);
  
  // Preloader state
  const [isPreloading, setIsPreloading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lenis smooth scroll setup - ONLY AFTER PRELOADING IS COMPLETE
  React.useEffect(() => {
    // Skip Lenis initialization if:
    // - Not on client side
    // - Still preloading
    // - Window doesn't exist
    if (typeof window === "undefined" || !isClient || isPreloading) return;

    // Clean up any existing instances
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // Clean up existing RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Wait for DOM to be fully ready
    const initTimeout = setTimeout(() => {
      try {
        // Ensure document.body and document.documentElement exist
        if (!document.body || !document.documentElement) {
          console.warn('DOM not ready for Lenis initialization');
          return;
        }

        // Create Lenis instance with safer options
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
          // Only set wrapper/content if they exist
          ...(document.body && { wrapper: document.body }),
          ...(document.documentElement && { content: document.documentElement })
        });

        lenisRef.current = lenis;

        // Make it globally accessible for Navbar
        if (window) {
          window.lenis = lenis;
          window.lenisInstance = lenis;
        }

        // Animation frame loop for smooth scrolling
        function raf(time) {
          if (lenisRef.current && !lenisRef.current.destroyed) {
            lenisRef.current.raf(time);
            rafRef.current = requestAnimationFrame(raf);
          }
        }
        rafRef.current = requestAnimationFrame(raf);

        // Start Lenis
        lenis.start();

        console.log('Lenis initialized successfully');
      } catch (error) {
        console.error("Lenis initialization error:", error);
        // Don't throw - let app continue without smooth scroll
      }
    }, 500); // Increased delay for better reliability

    return () => {
      clearTimeout(initTimeout);
      
      // Clean up RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      // Clean up Lenis
      if (lenisRef.current && !lenisRef.current.destroyed) {
        try {
          lenisRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying Lenis:', e);
        }
        lenisRef.current = null;
      }
      
      // Clean up global references
      if (typeof window !== "undefined") {
        window.lenis = null;
        window.lenisInstance = null;
      }
    };
  }, [isPreloading, isClient]);

  // Handle preload completion
  const handlePreloadComplete = () => {
    console.log('Preloader completed');
    setIsPreloading(false);
  };

  // Don't render anything on server side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Preloader - no need to pass refs anymore */}
      {isPreloading && (
        <Preload onComplete={handlePreloadComplete} />
      )}

      {/* Main Content */}
      <div className={`main-content ${isPreloading ? 'content-hidden' : 'content-visible'}`}>
        <Navbar />

        {/* HOME SECTION */}
        <section 
          id="home" 
          className="hero-container" 
          role="main"
          style={{ 
            minHeight: '100vh',
            paddingTop: '72px',
            scrollMarginTop: '0px'
          }}
        >
          <div className="hero-left">
            <div className="cube-background" aria-hidden="true">
              <VideoCube 
                onReady={() => console.log('VideoCube ready')}
                onError={(error) => console.error('VideoCube error:', error)}
              />
            </div>

            <div className="hero-content">
              <LeftHero />
            </div>
          </div>

          {/* Only render SplineRobot on desktop */}
          {isDesktop && (
            <aside className="hero-right" aria-label="3D Robot Animation">
              <SplineRobot 
                onReady={() => console.log('SplineRobot ready')}
                onError={(error) => console.error('SplineRobot error:', error)}
              />
            </aside>
          )}
        </section>
        
        {/* ABOUT SECTION */}
        <section 
          id="about" 
          style={{ 
            minHeight: '100vh',
            paddingTop: '72px',
            scrollMarginTop: '72px',
            marginTop: '-72px'
          }}
        >
          <AboutUs highlights={['SaiprasadJamdar','VibeCoding','AI','Backend','Gamethon2k25','FYTopper','competitive_programming','Awesome']} />
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" style={{ scrollMarginTop: '0px', background: 'linear-gradient(180deg,#000 0%,#0a0a0a 100%)' }}>
          <Projects />
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" aria-label="Skills" style={{ scrollMarginTop: '72px' }}>
          <MakeSkill />
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" style={{ position: 'relative' }}>
          <Experience />
        </section>

        {/* CONTACT FOOTER - This is the last section and should prevent any further scrolling */}
        <footer id="contact" aria-label="Contact" role="contentinfo" style={{ position: 'relative', zIndex: 10 }}>
          <ContactFooter />
        </footer>

      </div>
    </div>
  );
}