import React, { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navRef = useRef(null);

  // Navigation items for mobile
  const mobileNavItems = [
    { id: "#home", label: "home", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9,22 9,12 15,12 15,22" },
    { id: "#about", label: "about", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7m-4 0a4 4 0 1 1 8 0a4 4 0 0 1 -8 0" },
    { id: "#projects", label: "projects", icon: "M2 3h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3z M8 21h8 M12 17v4" },
    { id: "#skills", label: "skills", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21.02L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" },
    { id: "#achievements", label: "achievements", icon: "M6 9H4.5a2.5 2.5 0 0 1 0-5C11 4 12 8 12 8s1-4 7.5-4a2.5 2.5 0 0 1 0 5H18 M12 15l3-3h-2V9h-2v3H9l3 3z M12 15v6" },
    { id: "#research", label: "research", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h8 M8 11h8 M8 15h5" },
    { id: "#education", label: "education", icon: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 1-1 2-4 2s-4-1-4-2v-5" },
    { id: "#experience", label: "experience", icon: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M8 7h8 M8 11h8 M8 15h8 M4 7h16v13H4z" },
    { id: "#contact", label: "contact", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" }
  ];

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

  // Mouse/Touch handlers for sliding
  const handleMouseDown = (e) => {
    if (!navRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX || e.touches?.[0]?.pageX || 0);
    setScrollLeft(navRef.current.scrollLeft);
    navRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !navRef.current) return;
    e.preventDefault();
    const x = (e.pageX || e.touches?.[0]?.pageX || 0) - startX;
    navRef.current.scrollLeft = scrollLeft - x;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (navRef.current) {
      navRef.current.style.cursor = 'grab';
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    handleMouseDown(e);
  };

  const handleTouchMove = (e) => {
    handleMouseMove(e);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e) => handleMouseMove(e);
    const handleGlobalTouchEnd = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, startX, scrollLeft]);

  const handleNavClick = (e, targetId) => {
    if (isDragging) return; // Prevent navigation when dragging
    
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
            offset: targetId === "#home" ? 0 : -20,
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
          <nav className="nav-inline" aria-label="Primary">
            <div 
              className="logo" 
              title="Home" 
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
              SJ
            </div>
            <ul className="nav-links">
              <li><a className="nav-link" href="#about" onClick={(e)=>handleNavClick(e,"#about")}>about</a></li>
              <li><a className="nav-link" href="#projects" onClick={(e)=>handleNavClick(e,"#projects")}>projects</a></li>
              <li><a className="nav-link" href="#skills" onClick={(e)=>handleNavClick(e,"#skills")}>skills</a></li>
              <li><a className="nav-link" href="#achievements" onClick={(e)=>handleNavClick(e,"#achievements")}>achievements</a></li>
              <li><a className="nav-link" href="#research" onClick={(e)=>handleNavClick(e,"#research")}>research</a></li>
              <li><a className="nav-link" href="#education" onClick={(e)=>handleNavClick(e,"#education")}>education</a></li>
              <li><a className="nav-link" href="#experience" onClick={(e)=>handleNavClick(e,"#experience")}>experience</a></li>
              <li><a className="nav-link" href="#contact" onClick={(e)=>handleNavClick(e,"#contact")}>contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Sliding Navigation */}
      <nav className="mobile-sliding-nav" aria-label="Mobile Navigation">
        <div 
          className="mobile-nav-slider"
          ref={navRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="mobile-nav-track">
            {mobileNavItems.map((item, index) => (
              <div 
                key={item.id}
                className="mobile-nav-item" 
                onClick={(e) => handleNavClick(e, item.id)}
                title={item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              >
                <div className="mobile-nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={item.icon}/>
                  </svg>
                </div>
                <span className="mobile-nav-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Slide indicator */}
        <div className="slide-indicator">
          <div className="slide-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </nav>
    </>
  );
}