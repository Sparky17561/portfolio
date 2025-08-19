// Project.jsx
import React, { useEffect, useRef } from "react";
import "./project.css";

/**
 * Projects component
 * - Accepts optional prop `projects` (array of project objects)
 * - Each project: { id, title, short, long, tech: [], image, video, demo, repo, highlight }
 *
 * Example usage:
 * <Projects projects={[ { id:1, title:'My App', short:'...'} ]} />
 */

export default function Projects({ projects }) {
  const gridRef = useRef(null);

  // default sample projects (replace with your own)
  const defaultProjects = [
    {
      id: "p1",
      title: "Gamethon Winner",
      short: "Real-time multiplayer game prototype — winner of Gamethon2k25.",
      long: "Built a real-time game using Socket.IO, Phaser and Node.js. Implemented matchmaking, client prediction and a vivid neon UI.",
      tech: ["React", "Node", "Socket.IO", "Phaser"],
      image: "/assets/gamethon-poster.jpg", // replace
      video: "/assets/gamethon-demo.mp4",   // optional, replace
      demo: "#",
      repo: "#",
      highlight: true,
    },
    {
      id: "p2",
      title: "Portfolio CMS",
      short: "A small CMS to manage personal portfolio & projects.",
      long: "Admin UI with Markdown support and image uploads. Deploy-ready with CI/CD.",
      tech: ["Next.js", "Tailwind", "Sanity"],
      image: "/assets/portfolio-cms.jpg",
      demo: "#",
      repo: "#",
    },
    {
      id: "p3",
      title: "DSA Visualizer",
      short: "Interactive visualizer for common algorithms.",
      long: "Animated visual explanations with step controls and complexity overlays.",
      tech: ["Vanilla JS", "Canvas", "D3"],
      image: "/assets/dsa-visual.jpg",
      demo: "#",
      repo: "#",
    },
  ];

  const data = projects && projects.length ? projects : defaultProjects;

  // lightweight reveal on scroll using IntersectionObserver
  useEffect(() => {
    const nodes = gridRef.current?.querySelectorAll(".project-card");
    if (!nodes) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
          } else {
            // keep it repetitive: allow re-trigger
            e.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.18 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [data]);

  // play/pause video on hover (works with muted looped previews)
  const handleVideoHover = (e, play) => {
    const video = e.currentTarget.querySelector("video");
    if (!video) return;
    if (play) {
      video.currentTime = 0;
      video.play().catch(() => {}); // ignore play promise errors
    } else {
      video.pause();
      try { video.currentTime = 0; } catch {}
    }
  };

  return (
    <section className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-inner">
        <h3 id="projects-heading" className="projects-title">Selected projects</h3>

        <div className="projects-grid" ref={gridRef}>
          {data.map((p) => (
            <article
              key={p.id}
              className={`project-card ${p.highlight ? "project-highlight" : ""}`}
              onMouseEnter={(e) => handleVideoHover(e, true)}
              onMouseLeave={(e) => handleVideoHover(e, false)}
              tabIndex={0}
              aria-labelledby={`proj-${p.id}-title`}
            >
              <div className="project-media">
                {p.video ? (
                  <video
                    className="project-video"
                    src={p.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={p.image || ""}
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    className="project-image"
                    src={p.image || `https://via.placeholder.com/800x450?text=${encodeURIComponent(p.title)}`}
                    alt={`${p.title} screenshot`}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              <div className="project-body">
                <h4 className="project-title" id={`proj-${p.id}-title`}>{p.title}</h4>
                <p className="project-short">{p.short}</p>

                <div className="project-meta">
                  <ul className="tech-list" aria-hidden="true">
                    {p.tech?.slice(0, 6).map((t, i) => (
                      <li className="tech-item" key={i}>{t}</li>
                    ))}
                  </ul>

                  <div className="project-links">
                    {p.demo && (
                      <a className="btn btn-demo" href={p.demo} target="_blank" rel="noopener noreferrer">Live</a>
                    )}
                    {p.repo && (
                      <a className="btn btn-repo" href={p.repo} target="_blank" rel="noopener noreferrer">Code</a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
