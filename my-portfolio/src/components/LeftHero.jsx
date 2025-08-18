import React from "react";
import Typewriter from "./Typewriter";
import ResumeButton from "./ResumeButton";

/**
 * Left Hero Component
 * Note: we apply the .gradient-text class on the hero-name so the
 * exact same left→right 4-stop gradient is used.
 */
export default function LeftHero() {
  const sentences = [
    "Hey — I'm Saiprasad Jamdar, final year BE Computer Engineering @ SAKEC.",
    "I build web apps, tinker with ML models, and automate boring tasks.",
    "Open to internships and collaborations — let's build something cool together."
  ];

  return (
    <div className="left-hero-inner">
      {/* Apply both hero-name and gradient-text */}
      <h1 className="hero-name gradient-text" aria-label="Saiprasad Jamdar">
        <span className="name-line">Saiprasad</span>
        <span className="name-line">Jamdar</span>
      </h1>

      <div className="hero-sub">
        <Typewriter sentences={sentences} />
      </div>

      <div className="hero-cta">
        <ResumeButton href="/resume.pdf" />
      </div>
    </div>
  );
}
