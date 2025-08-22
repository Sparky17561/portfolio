// LeftHero.jsx
import React from "react";
import Typewriter from "./Typewriter";
import ResumeButton from "./ResumeButton";

// react-icons (no CDN, works in React)
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function LeftHero() {
  const LINKS = {
    linkedin: "https://www.linkedin.com/in/saiprasad-jamdar",
    instagram: "https://www.instagram.com/black__kitana/",
    github: "https://github.com/Sparky17561",
    leetcode: "https://leetcode.com/u/Black_Kitana/"
  };

  return (
    <div className="left-hero-inner" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="hero-name gradient-text" aria-label="Saiprasad Jamdar">
        <span className="name-line">Saiprasad</span>
        <span className="name-line">Jamdar</span>
      </h1>

      {/* Creative futuristic meta card under the name */}
      <div className="hero-meta" aria-label="Title, location and contact">
        <div className="meta-content">
          <div className="meta-row">
            <span className="hero-role">Software Developer</span>
            <span className="meta-divider" aria-hidden="true" />
            <span className="hero-location">Kalyan, Maharashtra, India</span>
          </div>

          <div className="meta-row contact-row">
            <a
              className="hero-email"
              href="mailto:studentjamdar@gmail.com"
              title="Email Saiprasad"
              aria-label="Email studentjamdar at gmail dot com"
            >
              studentjamdar@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* optional typewriter area (still commented out in original) */}
      {/* <div className="hero-sub">
        <Typewriter sentences={sentences} />
      </div> */}

      <div className="hero-cta" role="group" aria-label="Call to actions and social links">
        <ResumeButton href="/Saiprasad_Ulhas_Jamdar_Resume.pdf" className="resume-btn-hero" />

        <nav className="socials" aria-label="Social links">
          <a
            className="social-link"
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <FaLinkedin aria-hidden="true" />
          </a>

          <a
            className="social-link"
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>

          <a
            className="social-link"
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            aria-label="GitHub"
          >
            <FaGithub aria-hidden="true" />
          </a>

          <a
            className="social-link"
            href={LINKS.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            title="LeetCode"
            aria-label="LeetCode"
          >
            <SiLeetcode aria-hidden="true" />
          </a>
        </nav>
      </div>
    </div>
  );
}