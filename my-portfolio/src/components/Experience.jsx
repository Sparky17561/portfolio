import React from "react";

/* Tiny inline SVG icons (no external deps) */
const MonitorIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="4" width="18" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CodeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M16 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6L2 12l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BriefcaseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Data for timeline - FIXED: Use actual component references instead of strings */
const TIMELINE = [
  {
    role: "Upcoming Intern",
    company: "Wissen Technology",
    period: "Jan 2026 - Jul 2026",
    Icon: MonitorIcon,
    accent: "#00ff88",
    description: "Software Developer Intern",
    link: "#"
  },
  {
    role: "Python Developer Intern",
    company: "Mira Advanced Engineering (Remote)",
    period: "Jan 2024 - Feb 2024",
    Icon: CodeIcon,
    accent: "#00e676",
    description: "Designed and implemented desktop applications ...",
    // Replace the placeholder below with the Mira certificate / project URL (GitHub, Drive link, LinkedIn post, etc.)
    link: "https://www.linkedin.com/posts/saiprasad-jamdar_python-internship-certificate-activity-7166684181572403200-qvvA?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_9CmQBaKpho7VahiwxaLLmRw0aF3ggvC8"
  },
];


function TimelineItem({ item, side, index }) {
  const { Icon, accent } = item;
  
  return (
    <div className={`timeline-item ${side}`} data-index={index}>
      <div
        className="timeline-dot"
        style={{
          boxShadow: `0 0 28px ${accent}55, inset 0 0 10px ${accent}33`,
          borderColor: `${accent}33`,
          color: accent,
        }}
        aria-hidden="true"
      >
        {/* Now Icon is a React component, not a string */}
        <Icon size={18} />
      </div>

      <article
        className="timeline-card"
        style={{
          borderColor: `${accent}22`,
          background: `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))`,
        }}
        aria-labelledby={`exp-title-${index}`}
        tabIndex={0}
      >
        <div className="meta">
          <span className="period" style={{ color: accent }}>
            {item.period}
          </span>
        </div>

        <h3 id={`exp-title-${index}`} className="role">
          {item.role}
        </h3>
        <div className="company">{item.company}</div>

        <p className="desc">{item.description}</p>

        <div className="card-actions">
  {item.link ? (
    <a
      className="action-primary"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // prevent router from hijacking navigation in SPAs and ensure a real new tab
        e.preventDefault();
        window.open(item.link, "_blank", "noopener,noreferrer");
      }}
      aria-label={`Open ${item.company} post or certificate`}
    >
      View post
    </a>
  ) : null}
</div>

      </article>
    </div>
  );
}

export default function Experience() {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const cards = document.querySelectorAll(".timeline-card");
    cards.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="experience-section" aria-labelledby="experience-heading">
      <div className="experience-inner">
        <header className="experience-header">
          <h2 id="experience-heading" className="title">
            Experience
          </h2>
          <p className="subtitle">
            A curated timeline of roles, wins, and the things I built along the way — crafted with motion &amp; polish.
          </p>
        </header>

        <div className="timeline">
          <div className="timeline-spine" aria-hidden="true" />
          {TIMELINE.map((it, i) => (
            <TimelineItem key={i} item={it} side={i % 2 === 0 ? "left" : "right"} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}