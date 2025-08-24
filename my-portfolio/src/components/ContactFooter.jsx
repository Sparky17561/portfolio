// src/components/ContactSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaFilePdf } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import cubeVideo from "./cube_animation.mp4"; // <- adjust path to where your video lives


export default function ContactSection() {
  const footerRef = useRef(null);
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection (basic)
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      return isMobileDevice || (isTouchDevice && isSmallScreen);
    };

    setIsMobile(checkMobile());
    const onResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Video load/play logic (skip on mobile)
  useEffect(() => {
    if (isMobile) {
      setIsLoading(false);
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    let mounted = true;
    const onLoadStart = () => mounted && setIsLoading(true);
    const onCanPlay = () => {
      if (!mounted) return;
      setIsLoading(false);
      v.muted = true;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    };
    const onError = () => {
      if (!mounted) return;
      setIsLoading(false);
      setHasError(true);
      console.error("ContactSection: video failed to load");
    };

    v.addEventListener("loadstart", onLoadStart);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onError);

    v.preload = "auto";
    v.playsInline = true;
    v.loop = true;
    v.muted = true;

    return () => {
      mounted = false;
      try {
        v.removeEventListener("loadstart", onLoadStart);
        v.removeEventListener("canplay", onCanPlay);
        v.removeEventListener("error", onError);
      } catch (e) {}
    };
  }, [isMobile]);

  // Reserve footer space & update CSS var for layout
  useEffect(() => {
    if (!footerRef.current) return;

    const setFooterPadding = () => {
      const rect = footerRef.current.getBoundingClientRect();
      const h = Math.max(0, Math.ceil(rect.height));
      document.body.style.paddingBottom = `${h}px`;
      document.documentElement.style.setProperty("--contact-footer-height", `${h}px`);
    };

    setFooterPadding();

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => window.requestAnimationFrame(setFooterPadding));
      ro.observe(footerRef.current);
    }
    const onResize = () => window.requestAnimationFrame(setFooterPadding);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) try { ro.disconnect(); } catch (e) {}
      document.body.style.paddingBottom = "";
      document.documentElement.style.removeProperty("--contact-footer-height");
    };
  }, [footerRef]);

  // Prevent horizontal overflow while mounted
  useEffect(() => {
    const prevHtmlOverflowX = document.documentElement.style.overflowX || "";
    const prevBodyOverflowX = document.body.style.overflowX || "";
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.body.style.overflowX = prevBodyOverflowX;
    };
  }, []);

  return (
    <section ref={footerRef} id="contact" className="contact-section" aria-label="Contact footer">
      {/* Video background (desktop only) */}
      {!isMobile && (
        <div className="contact-media" aria-hidden="true">
          {isLoading && !hasError && (
            <div className="media-loading" role="status" aria-live="polite">
              <div className="spinner" />
              <div className="loading-text">Loading animation…</div>
            </div>
          )}

          {hasError && (
            <div className="media-loading" role="alert">
              Animation failed to load
            </div>
          )}

          <video
            ref={videoRef}
            className="media-video"
            preload="auto"
            playsInline
            muted
            loop
            aria-hidden="true"
          >
            <source src={cubeVideo} type="video/mp4" />
          </video>

          <div className="media-overlay" aria-hidden="true" />
        </div>
      )}

      {/* Content overlay */}
      <div className="contact-content" role="region" aria-label="Contact information">
        <div className="contact-panel">
          <div className="panel-header">
            <h2 className="panel-title">Let's build something together</h2>
            <p className="panel-subtitle">Open to internships, freelance, and collaborations — say hi!</p>
          </div>

          <div className="contact-methods">
            <a className="contact-method primary" href="mailto:studentjamdar@gmail.com" aria-label="Send email">
              <div className="method-icon" aria-hidden>
                {/* kept inline mail icon for clarity */}
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
                  <path fill="currentColor" d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11zM4.5 6a.5.5 0 00-.5.5V8l8 4.5L20 8V6.5a.5.5 0 00-.5-.5h-15z"/>
                </svg>
              </div>
              <div className="method-content">
                <span className="method-label">Email</span>
                <span className="method-value">studentjamdar@gmail.com</span>
              </div>
            </a>

            <a
              className="contact-method secondary"
              href="https://www.linkedin.com/in/saiprasad-jamdar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <div className="method-icon" aria-hidden>
                <FaLinkedin size={20} />
              </div>
              <div className="method-content">
                <span className="method-label">LinkedIn</span>
                <span className="method-value">Connect with me</span>
              </div>
            </a>

            <a
              className="contact-method prep-material"
              href="/PrepMaterial.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View PrepMaterial PDF"
            >
              <div className="method-icon" aria-hidden>
                <FaFilePdf size={20} />
              </div>
              <div className="method-content">
                <span className="method-label">PrepMaterial</span>
                <span className="method-value">View study materials</span>
              </div>
            </a>
          </div>

          {/* Social links */}
          <div className="social-section">
            <h3 className="social-title">Find me elsewhere</h3>

            <div className="social-grid">
              <a
                className="social-link"
                href="https://github.com/Sparky17561"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <span className="icon-wrapper" aria-hidden>
                  <FaGithub size={28} />
                </span>
                <span className="social-label">GitHub</span>
              </a>

              <a
                className="social-link"
                href="https://www.instagram.com/black__kitana/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <span className="icon-wrapper" aria-hidden>
                  <FaInstagram size={28} />
                </span>
                <span className="social-label">Instagram</span>
              </a>

              <a
                className="social-link"
                href="https://leetcode.com/u/Black_Kitana/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode"
              >
                <span className="icon-wrapper" aria-hidden>
                  <SiLeetcode size={28} />
                </span>
                <span className="social-label">LeetCode</span>
              </a>
            </div>
          </div>

          {/* <div className="panel-footer">
            <div className="footer-content">
              <p className="copyright">© {new Date().getFullYear()} Saiprasad Jamdar</p>
              <p className="built-with">
                Built with <span className="heart">❤️</span> and lots of ☕
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}