// LeftHero.jsx
import React from "react";
import Typewriter from "./Typewriter";
import ResumeButton from "./ResumeButton";

// react-icons (no CDN, works in React)
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function LeftHero() {
  const sentences = [
    "Hey — I'm Saiprasad Jamdar, final year BE Computer Engineering @ SAKEC.",
    "I build web apps, tinker with ML models, and automate boring tasks.",
    "Open to internships and collaborations — let's build something cool together."
  ];

  // replace URLs below with your real accounts
  const LINKS = {
    linkedin: "https://www.linkedin.com/in/your-profile",
    instagram: "https://www.instagram.com/your-profile",
    github: "https://github.com/your-profile",
    leetcode: "https://leetcode.com/your-profile"
  };

  return (
    <div className="left-hero-inner">
      <h1 className="hero-name gradient-text" aria-label="Saiprasad Jamdar">
        <span className="name-line">Saiprasad</span>
        <span className="name-line">Jamdar</span>
      </h1>

      {/* <div className="hero-sub">
        <Typewriter sentences={sentences} />
      </div> */}

      <div className="hero-cta">
        <ResumeButton href="/resume.pdf" />

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
