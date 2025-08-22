import React, { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LeftHero from "./components/LeftHero";
import SplineRobot from "./components/SplineRobot";
import VideoCube from "./components/VideoCube";
import AboutUs from "./components/AboutUs";
import Projects from "./components/Projects";
import MakeSkill from "./components/MakeSkill";
import Experience from "./components/Experience";
import Education from "./components/Education"; // New import
import Achievements from "./components/Achievements";
import Research from "./components/Research";
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

  // Lenis smooth scroll setup with scroll limiting
  React.useEffect(() => {
    // Skip Lenis initialization if not ready
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

    // Wait for DOM to be ready
    const initTimeout = setTimeout(() => {
      try {
        // Create simple Lenis instance
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
          smoothWheel: true,
          wheelMultiplier: 1.2,
          touchMultiplier: 1.8,
          normalizeWheel: true,
          autoResize: true
        });

        lenisRef.current = lenis;

        // Add scroll limiting for contact section
        lenis.on('scroll', ({ scroll }) => {
          const contactSection = document.querySelector('#contact');
          if (contactSection) {
            const maxScroll = contactSection.offsetTop;
            // Prevent scrolling past contact section
            if (scroll > maxScroll) {
              lenis.scrollTo(maxScroll, { immediate: true });
            }
          }
        });

        // Make it globally accessible for Navbar
        if (window) {
          window.lenis = lenis;
          window.lenisInstance = lenis;
        }

        // Animation frame loop
        function raf(time) {
          if (lenisRef.current && !lenisRef.current.destroyed) {
            lenisRef.current.raf(time);
            rafRef.current = requestAnimationFrame(raf);
          }
        }
        rafRef.current = requestAnimationFrame(raf);

        // Start Lenis
        lenis.start();

        console.log('Lenis initialized successfully with scroll limiting');
      } catch (error) {
        console.error("Lenis initialization error:", error);
      }
    }, 100); // Shorter delay since we know scrolling works

    return () => {
      clearTimeout(initTimeout);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      if (lenisRef.current && !lenisRef.current.destroyed) {
        try {
          lenisRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying Lenis:', e);
        }
        lenisRef.current = null;
      }
      
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

      {/* Main Content - This container will have a fixed height to prevent over-scrolling */}
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

        {/* EDUCATION SECTION - NEW */}
        <section id="education" style={{ scrollMarginTop: '72px' }}>
          <Education />
        </section>

        {/* ACHIEVEMENTS SECTION */}
        <section id="achievements" style={{ scrollMarginTop: '72px' }}>
          <Achievements />
        </section>

        {/* RESEARCH SECTION - NEW */}
        <section id="research" style={{ scrollMarginTop: '72px' }}>
          <Research />
        </section>

        {/* CONTACT FOOTER - This is the final section that should stick at the bottom */}
        <footer 
          id="contact" 
          aria-label="Contact" 
          role="contentinfo" 
          style={{ 
            position: 'relative', 
            zIndex: 10,
            minHeight: '100vh' // Ensure it takes full viewport height
          }}
        >
          <ContactFooter />
        </footer>

      </div>
    </div>
  );
}