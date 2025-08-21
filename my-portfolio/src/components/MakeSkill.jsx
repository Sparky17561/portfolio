import React from "react";


/**
 * MakeSkill.jsx
 * Seamless infinite horizontal marquee (multi-row).
 * Each row contains two identical groups so translating -50% is perfectly seamless.
 */

const TAGS = [
  "HTML", "CSS", "JavaScript", "ReactJS", "Python", "NodeJS", "Express",
  "Django", "Vite", "Bootstrap", "Gsap", "Lenis", "Three.js", "Shaders", "Figma",
  "MySQL", "CapCut", "Langchain", "Machine Learning", "Deep Learning", "NLP", "AWS",
  "Prisma", "PostgreSQL", "MongoDB", "WebGL", "Gunicorn", "Nginx",
];

function MarqueeRow({ tags, speed = 20, reverse = false, rowIndex = 0 }) {
  // direction handled by CSS animation-direction (normal | reverse)
  const direction = reverse ? "reverse" : "normal";

  return (
    <div
      className="marquee-row"
      style={{
        // set row-specific duration and direction using inline style so it's easy to tweak
        ["--marquee-duration"]: `${speed}s`,
        ["--marquee-direction"]: direction,
      }}
      aria-hidden="false"
    >
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction,
        }}
        role="list"
      >
        <div className="marquee-group" aria-hidden="true">
          {tags.map((t, i) => (
            <span className="skill-pill" key={`g1-${t}-${i}`}>
              {t}
            </span>
          ))}
        </div>

        <div className="marquee-group" aria-hidden="true">
          {tags.map((t, i) => (
            <span className="skill-pill" key={`g2-${t}-${i}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MakeSkill() {
  // Configure rows: speed in seconds and whether direction is reversed
  const rows = [
    { speed: 22, reverse: false },
    { speed: 28, reverse: true },
    { speed: 18, reverse: false },
  ];

  return (
    <section id="skills" className="skills-marquee-section" aria-label="Skills">
      <div className="skills-marquee-inner">
        <header className="skills-header">
          <h2>Skills &amp; Tools</h2>
          <p className="lead">A quick visual of the tools and tech I use — scrolls infinitely.</p>
        </header>

        <div className="marquee-wrap" role="presentation">
          {rows.map((r, idx) => (
            <MarqueeRow key={idx} tags={TAGS} speed={r.speed} reverse={r.reverse} rowIndex={idx} />
          ))}

          {/* fade masks */}
          <div className="marquee-mask left" aria-hidden="true" />
          <div className="marquee-mask right" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
