import React, { useState } from "react";

// Resume Button Component
export default function ResumeButton({ href = "/resume.pdf" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="resume-btn-wrapper">
      <a
        href={href}
        className="resume-btn"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`resume-btn-glow ${isHovered ? 'active' : ''}`} />
        <div className="resume-btn-shine" />
        <span className="resume-btn-text">Resume</span>
      </a>
    </div>
  );
}