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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header className={`nav${isOpen ? " open" : ""}`}>
        <div className="nav-inner">
          <div className="logo" title="Home">
            SJ
          </div>

          {/* Inline links (desktop) */}
          <nav className="nav-inline" aria-label="Primary">
            <ul className="nav-links">
              <li><a className="nav-link" href="#about">about</a></li>
              <li><a className="nav-link" href="#projects">projects</a></li>
              <li><a className="nav-link" href="#experience">experience</a></li>
              <li><a className="nav-link" href="#community">community</a></li>
              <li><a className="nav-link" href="#blog">blog</a></li>
              <li><a className="nav-link" href="#contact">contact</a></li>
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
              <li><a className="nav-link" href="#about" onClick={closeMenu}>about</a></li>
              <li><a className="nav-link" href="#projects" onClick={closeMenu}>projects</a></li>
              <li><a className="nav-link" href="#experience" onClick={closeMenu}>experience</a></li>
              <li><a className="nav-link" href="#community" onClick={closeMenu}>community</a></li>
              <li><a className="nav-link" href="#blog" onClick={closeMenu}>blog</a></li>
              <li><a className="nav-link" href="#contact" onClick={closeMenu}>contact</a></li>
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