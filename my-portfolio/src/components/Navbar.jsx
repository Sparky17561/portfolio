import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // close menu when resizing to desktop so links reappear properly
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 900 && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  // close on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`Mobile nav clicked: ${targetId}`);
    
    // Close menu immediately for better UX
    setIsOpen(false);
    
    // Then scroll with a delay
    setTimeout(() => {
      const lenis = window.lenis || window.lenisInstance;
      const el = document.querySelector(targetId);
      
      console.log(`Navigating to: ${targetId}`, { el, lenis });
      
      if (el && lenis) {
        try {
          lenis.scrollTo(el, {
            offset: targetId === "#home" ? 0 : -20, // Reduced offset since no top nav on mobile
            duration: 1.2
          });
          console.log(`Lenis scroll to ${targetId} initiated`);
        } catch (error) {
          console.warn("Lenis scroll error:", error);
          const offsetTop = targetId === "#home" ? 0 : el.offsetTop - 20;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } else if (el) {
        console.log(`Using fallback scroll for ${targetId}`);
        const offsetTop = targetId === "#home" ? 0 : el.offsetTop - 20;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        console.warn(`Element not found: ${targetId}`);
        if (targetId === "#home") {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setTimeout(() => {
      const lenis = window.lenis || window.lenisInstance;
      const homeEl = document.querySelector("#home");
      
      console.log("Logo clicked, navigating to home", { homeEl, lenis });
      
      if (homeEl && lenis) {
        try {
          lenis.scrollTo(homeEl, {
            offset: 0,
            duration: 1.2,
            onComplete: () => setIsOpen(false)
          });
        } catch (error) {
          console.warn("Logo Lenis scroll error:", error);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => setIsOpen(false), 500);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setIsOpen(false), 500);
      }
    }, 50);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <header className="nav">
        <div className="nav-inner">
          <div 
            className="logo" 
            title="Home" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            SJ
          </div>

          <nav className="nav-inline" aria-label="Primary">
            <ul className="nav-links">
              <li><a className="nav-link" href="#about" onClick={(e)=>handleNavClick(e,"#about")}>about</a></li>
              <li><a className="nav-link" href="#projects" onClick={(e)=>handleNavClick(e,"#projects")}>projects</a></li>
              <li><a className="nav-link" href="#skills" onClick={(e)=>handleNavClick(e,"#skills")}>skills</a></li>
              <li><a className="nav-link" href="#experience" onClick={(e)=>handleNavClick(e,"#experience")}>experience</a></li>
              <li><a className="nav-link" href="#contact" onClick={(e)=>handleNavClick(e,"#contact")}>contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-nav-container">
          <div 
            className="mobile-nav-item" 
            onClick={handleLogoClick}
            title="Home"
          >
            <div className="mobile-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span className="mobile-nav-label">home</span>
          </div>

          <div 
            className="mobile-nav-item" 
            onClick={(e) => handleNavClick(e, "#about")}
            title="About"
          >
            <div className="mobile-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="mobile-nav-label">about</span>
          </div>

          <div 
            className="mobile-nav-item" 
            onClick={(e) => handleNavClick(e, "#projects")}
            title="Projects"
          >
            <div className="mobile-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <span className="mobile-nav-label">projects</span>
          </div>

          <div 
            className="mobile-nav-item" 
            onClick={(e) => handleNavClick(e, "#skills")}
            title="Skills"
          >
            <div className="mobile-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <span className="mobile-nav-label">skills</span>
          </div>

          <div 
            className="mobile-nav-item" 
            onClick={(e) => handleNavClick(e, "#contact")}
            title="Contact"
          >
            <div className="mobile-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <span className="mobile-nav-label">contact</span>
          </div>
        </div>
      </nav>
    </>
  );
}