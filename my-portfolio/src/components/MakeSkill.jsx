// Skills.jsx
import React from "react";


const TAGS = [
  "HTML", "CSS", "JavaScript", "ReactJS", "Python", "NodeJS", "Express",
  "Django", "Vite", "Bootstrap", "Gsap", "Lenis", "Three.js", "Shaders", "Figma",
  "MySQL", "CapCut", "Langchain", "Machine Learning", "Deep Learning", "NLP", "AWS",
  "Prisma", "PostgreSQL", "MongoDB", "WebGL", "Gunicorn", "Nginx",
];

export default function Skills() {
  return (
    <section id="skills" className="skills-section" aria-label="Skills and tools">
      <div className="skills-inner">
        <header className="skills-header">
          <h2>Skills &amp; Tools</h2>
          <p className="lead">A quick visual of the tools and tech I use — hover or tab to highlight.</p>
        </header>

        <ul className="skills-grid" role="list" aria-label="List of skills">
          {TAGS.map((tag, i) => (
            <li key={`${tag}-${i}`} role="listitem" className="skill-item">
              {/* Use a button so it's keyboard-focusable by default */}
              <button
                type="button"
                className="skill-pill"
                aria-pressed="false"
                aria-label={`Skill: ${tag}`}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
