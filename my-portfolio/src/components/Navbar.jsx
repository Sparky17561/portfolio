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

  const closeMenu = () => setIsOpen(false);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    // FIXED: Close menu immediately for better UX
    setIsOpen(false);
    
    // FIXED: Shorter delay and better error handling
    setTimeout(() => {
      const lenis = window.lenis || window.lenisInstance;
      const el = document.querySelector(targetId);
      
      console.log(`Navigating to: ${targetId}`, { el, lenis }); // Debug log
      
      if (el && lenis) {
        try {
          lenis.scrollTo(el, {
            offset: targetId === "#home" ? 0 : -72, // No offset for home, -72 for others
            duration: 1.2
          });
        } catch (error) {
          console.warn("Lenis scroll error:", error);
          // Fallback if Lenis fails
          const offsetTop = targetId === "#home" ? 0 : el.offsetTop - 72;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      } else if (el) {
        // FIXED: Better fallback scroll
        const offsetTop = targetId === "#home" ? 0 : el.offsetTop - 72;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        console.warn(`Element not found: ${targetId}`);
        // Last resort - try scrolling to top if home
        if (targetId === "#home") {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    }, 50); // FIXED: Reduced delay
  };

  // FIXED: Handle logo click to go to home
  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    
    setTimeout(() => {
      const lenis = window.lenis || window.lenisInstance;
      const homeEl = document.querySelector("#home");
      
      console.log("Logo clicked, navigating to home", { homeEl, lenis }); // Debug
      
      if (homeEl && lenis) {
        try {
          lenis.scrollTo(homeEl, {
            offset: 0,
            duration: 1.2
          });
        } catch (error) {
          console.warn("Logo Lenis scroll error:", error);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Always fallback to top scroll for logo
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      <header className={`nav${isOpen ? " open" : ""}`}>
        <div className="nav-inner">
          {/* FIXED: Logo now navigates to home section */}
          <div 
            className="logo" 
            title="Home" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            SJ
          </div>

          {/* Inline links (desktop) */}
          <nav className="nav-inline" aria-label="Primary">
            <ul className="nav-links">
              <li><a className="nav-link" href="#home" onClick={(e)=>handleNavClick(e,"#home")}>home</a></li>
              <li><a className="nav-link" href="#about" onClick={(e)=>handleNavClick(e,"#about")}>about</a></li>
              <li><a className="nav-link" href="#projects" onClick={(e)=>handleNavClick(e,"#projects")}>projects</a></li>
              <li><a className="nav-link" href="#skills" onClick={(e)=>handleNavClick(e,"#skills")}>skills</a></li>
              <li><a className="nav-link" href="#experience" onClick={(e)=>handleNavClick(e,"#experience")}>experience</a></li>
              <li><a className="nav-link" href="#community" onClick={(e)=>handleNavClick(e,"#community")}>community</a></li>
              <li><a className="nav-link" href="#blog" onClick={(e)=>handleNavClick(e,"#blog")}>blog</a></li>
              <li><a className="nav-link" href="#contact" onClick={(e)=>handleNavClick(e,"#contact")}>contact</a></li>
            </ul>
          </nav>

          {/* Hamburger button */}
          <button
            className={`hamburger ${isOpen ? "open is-active" : ""}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((s) => !s)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          {/* Mobile dropdown */}
          <nav className={`nav-menu ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
            <ul className="nav-links">
              <li><a className="nav-link" href="#home" onClick={(e)=>handleNavClick(e,"#home")}>home</a></li>
              <li><a className="nav-link" href="#about" onClick={(e)=>handleNavClick(e,"#about")}>about</a></li>
              <li><a className="nav-link" href="#projects" onClick={(e)=>handleNavClick(e,"#projects")}>projects</a></li>
              <li><a className="nav-link" href="#experience" onClick={(e)=>handleNavClick(e,"#experience")}>experience</a></li>
              <li><a className="nav-link" href="#community" onClick={(e)=>handleNavClick(e,"#community")}>community</a></li>
              <li><a className="nav-link" href="#blog" onClick={(e)=>handleNavClick(e,"#blog")}>blog</a></li>
              <li><a className="nav-link" href="#contact" onClick={(e)=>handleNavClick(e,"#contact")}>contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Overlay to close menu when clicking outside */}
      <div 
        className={`nav-menu-overlay ${isOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </>
  );
}