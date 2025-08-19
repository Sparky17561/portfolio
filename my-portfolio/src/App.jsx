import React from "react";
import Navbar from "./components/Navbar";
import LeftHero from "./components/LeftHero";
import SplineRobot from "./components/SplineRobot";
import VideoCube from "./components/VideoCube";
import AboutUs from "./components/AboutUs";
import "./App.css";

import Lenis from "@studio-freight/lenis";
import Projects from "./components/Project";

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

      {/* PROJECTS SECTION - Enhanced content */}
      <section 
        id="projects" 
        className="content-section"
        style={{ 
          minHeight: '100vh', 
          padding: '120px 20px 80px',
          scrollMarginTop: '72px',
          background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)'
        }}
      >
        <Projects/>
          
      </section>

      {/* EXPERIENCE SECTION */}
      <section 
        id="experience" 
        className="content-section"
        style={{ 
          minHeight: '100vh', 
          padding: '120px 20px 80px',
          scrollMarginTop: '72px',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)'
        }}
      >
        <div className="section-content">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2024 - Present</div>
              <div className="timeline-content">
                <h3>Senior Frontend Developer</h3>
                <p className="company">Tech Company Inc.</p>
                <p>Leading frontend development for enterprise applications using React and modern web technologies.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2022 - 2024</div>
              <div className="timeline-content">
                <h3>Full Stack Developer</h3>
                <p className="company">Startup Solutions</p>
                <p>Built scalable web applications and APIs, mentored junior developers.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2020 - 2022</div>
              <div className="timeline-content">
                <h3>Frontend Developer</h3>
                <p className="company">Digital Agency</p>
                <p>Developed responsive websites and interactive user interfaces for various clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section 
        id="community" 
        className="content-section"
        style={{ 
          minHeight: '100vh', 
          padding: '120px 20px 80px',
          scrollMarginTop: '72px',
          background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)'
        }}
      >
        <div className="section-content">
          <h2 className="section-title">Community</h2>
          <div className="community-grid">
            <div className="community-card">
              <h3>Open Source</h3>
              <p>Contributing to popular React libraries and tools</p>
              <span className="community-stat">50+ contributions</span>
            </div>
            <div className="community-card">
              <h3>Speaking</h3>
              <p>Tech talks at conferences and meetups</p>
              <span className="community-stat">12 talks given</span>
            </div>
            <div className="community-card">
              <h3>Mentoring</h3>
              <p>Helping junior developers grow their skills</p>
              <span className="community-stat">25+ mentees</span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section 
        id="blog" 
        className="content-section"
        style={{ 
          minHeight: '100vh', 
          padding: '120px 20px 80px',
          scrollMarginTop: '72px',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)'
        }}
      >
        <div className="section-content">
          <h2 className="section-title">Blog</h2>
          <div className="blog-grid">
            <article className="blog-card">
              <div className="blog-date">Aug 2025</div>
              <h3>Building Smooth Animations with Lenis</h3>
              <p>Deep dive into creating buttery smooth scroll experiences for modern web applications.</p>
              <span className="read-time">5 min read</span>
            </article>
            <article className="blog-card">
              <div className="blog-date">Jul 2025</div>
              <h3>React Performance Optimization</h3>
              <p>Best practices for optimizing React applications and avoiding common performance pitfalls.</p>
              <span className="read-time">8 min read</span>
            </article>
            <article className="blog-card">
              <div className="blog-date">Jun 2025</div>
              <h3>CSS Animation Techniques</h3>
              <p>Modern CSS animation patterns that enhance user experience without compromising performance.</p>
              <span className="read-time">6 min read</span>
            </article>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section 
        id="contact" 
        className="content-section"
        style={{ 
          minHeight: '100vh', 
          padding: '120px 20px 80px',
          scrollMarginTop: '72px',
          background: 'linear-gradient(180deg, #111 0%, #000 100%)'
        }}
      >
        <div className="section-content">
          <h2 className="section-title">Contact</h2>
          <div className="contact-content">
            <p className="contact-intro">Let's build something amazing together</p>
            <div className="contact-methods">
              <a href="mailto:hello@saiprasad.dev" className="contact-link">
                <span className="contact-icon">📧</span>
                hello@saiprasad.dev
              </a>
              <a href="https://linkedin.com/in/saiprasad" className="contact-link">
                <span className="contact-icon">💼</span>
                LinkedIn
              </a>
              <a href="https://github.com/saiprasad" className="contact-link">
                <span className="contact-icon">💻</span>
                GitHub
              </a>
              <a href="https://twitter.com/saiprasad" className="contact-link">
                <span className="contact-icon">🐦</span>
                Twitter
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}