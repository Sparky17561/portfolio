import React from "react";
import Typewriter from "./Typewriter";
import ResumeButton from "./ResumeButton";

// Left Hero Component
export default function LeftHero() {
  const sentences = [
    "Hey — I'm Saiprasad Jamdar, final year BE Computer Engineering @ SAKEC.",
    "I build web apps, tinker with ML models, and automate boring tasks.",
    "Open to internships and collaborations — let's build something cool together."
  ];

  return (
    <div className="left-hero-inner">
      <h1 className="hero-name">
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
