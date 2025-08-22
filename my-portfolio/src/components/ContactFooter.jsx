// ContactSection.jsx
import React, { useEffect, useRef, useState } from "react";
import cubeVideo from "./cube_animation.mp4"; // put the video file alongside

export default function ContactSection() {
  const footerRef = useRef(null);
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Video loading logic (same as you had)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoadStart = () => setIsLoading(true);
    const onCanPlay = () => {
      setIsLoading(false);
      // autoplay muted + loop
      v.muted = true;
      v.play().catch(() => {
        // autoplay may be blocked; that's okay
      });
    };
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    v.addEventListener("loadstart", onLoadStart);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onError);

    v.preload = "auto";
    v.playsInline = true;
    v.loop = true;
    v.muted = true;

    return () => {
      v.removeEventListener("loadstart", onLoadStart);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, []);

  // Set footer height on body padding and CSS var to prevent page overscroll.
  useEffect(() => {
    if (!footerRef.current) return;

    const setFooterHeightVars = () => {
      const rect = footerRef.current.getBoundingClientRect();
      const h = Math.ceil(rect.height);
      // set CSS var for layout and also add body padding so content doesn't hide behind the fixed footer
      document.documentElement.style.setProperty("--contact-footer-height", `${h}px`);
      document.body.style.paddingBottom = `${h}px`;
    };

    // Initial set
    setFooterHeightVars();

    // ResizeObserver to update height when content/layout changes
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        // throttle via requestAnimationFrame
        window.requestAnimationFrame(setFooterHeightVars);
      });
      ro.observe(footerRef.current);
    }

    // window resize fallback
    const onWinResize = () => window.requestAnimationFrame(setFooterHeightVars);
    window.addEventListener("resize", onWinResize, { passive: true });

    // Prevent horizontal overflow caused by large video temporarily
    const prevOverflowX = document.documentElement.style.overflowX || "";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      window.removeEventListener("resize", onWinResize);
      if (ro) {
        try { ro.disconnect(); } catch (e) {}
      }
      // cleanup style changes
      document.body.style.paddingBottom = "";
      document.documentElement.style.removeProperty("--contact-footer-height");
      document.documentElement.style.overflowX = prevOverflowX;
    };
  }, []);

  return (
    <section
      className="contact-section"
      id="contact"
      aria-label="Contact"
      ref={footerRef}
      role="contentinfo"
    >
      {/* Video background (absolute on desktop, static on mobile) */}
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

      {/* Content overlay (right-side on desktop; below on mobile) */}
      <div className="contact-content" role="region" aria-label="Contact links">
        <div className="contact-panel" role="region" aria-label="Contact panel">
          <div className="panel-copy">
            <h3>Let's build something together</h3>
            <p className="panel-sub">
              Open to internships, freelance, and collaborations — say hi!
            </p>
          </div>

          <nav className="panel-links" aria-label="Quick links">
            <a className="panel-link" href="#about">About</a>
            <a className="panel-link" href="#projects">Projects</a>
            <a className="panel-link" href="#skills">Skills</a>
            <a className="panel-link" href="#experience">Experience</a>
            <a className="panel-link" href="#contact">Contact</a>
            <a className="panel-link" href="#blog">Blog</a>
          </nav>

          <div className="panel-actions">
            <a
              className="btn-email"
              href="mailto:studentjamdar@gmail.com"
              aria-label="Send email"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
                <path fill="currentColor" d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11zM4.5 6a.5.5 0 00-.5.5V8l8 4.5L20 8V6.5a.5.5 0 00-.5-.5h-15z"/>
              </svg>
              <span>Email</span>
            </a>

            <div className="socials" aria-label="Social links">
              <a
                className="icon"
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M6.94 6.5a1.94 1.94 0 11-.002-3.88 1.94 1.94 0 01.002 3.88zM4.5 8.5h4v11h-4v-11zM10.5 8.5h3.84v1.5h.05c.54-1 1.88-2 3.86-2 4.13 0 4.9 2.7 4.9 6.2v5.3h-4v-4.7c0-1.12 0-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.47v4.8h-4v-11z"/></svg>
              </a>

              <a
                className="icon"
                href="https://github.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M12 .5C5.7.5.9 5.3.9 11.6c0 4.6 3 8.5 7.2 9.9.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.2-3.5-1.2-.5-1.3-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.9.1-.6.4-1.1.7-1.4-2.3-.3-4.7-1.2-4.7-5.3 0-1.2.4-2.2 1-3 .1-.3-.4-1.4.1-2.9 0 0 .8-.2 2.8 1C10 4.9 11.4 4.8 12 4.8c.6 0 2 .1 3.3.6 2-1.2 2.8-1 2.8-1 .5 1.4 0 2.5.1 2.9.6.9 1 1.9 1 3 0 4.1-2.4 4.9-4.7 5.2.4.4.8 1 .8 2v3c0 .3.2.6.7.5 4.2-1.4 7.2-5.4 7.2-9.9C23.1 5.3 18.3.5 12 .5z"/></svg>
              </a>

              <a
                className="icon"
                href="https://instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A4.8 4.8 0 1016.8 13 4.8 4.8 0 0012 8.2zm6.4-2a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2zM12 10.1A1.9 1.9 0 1110.1 12 1.9 1.9 0 0112 10.1z"/></svg>
              </a>

              <a
                className="icon"
                href="https://leetcode.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                  <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="Inter, Arial, sans-serif">LC</text>
                </svg>
              </a>
            </div>
          </div>

          <div className="panel-footer">
            <small>© {new Date().getFullYear()} Saiprasad Jamdar — Built with ❤️</small>
          </div>
        </div>
      </div>
    </section>
  );
}
