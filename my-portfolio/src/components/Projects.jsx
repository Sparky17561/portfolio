import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// keep this in sync with CSS --navbar-height variable (you set to 0)
const NAVBAR_HEIGHT = 0;

const Projects = () => {
  const containerRef = useRef(null);
  const slideshowRef = useRef(null);
  const linkWrapperRef = useRef(null);
  const pathRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const linkRef = useRef(null);
  const introRef = useRef(null);
  const titleRef = useRef(null);
  const stackItemRefs = useRef([]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const currentIndexRef = useRef(0);

  // quickTo for link hover parallax
  const xTo = useRef(null);
  const yTo = useRef(null);

  const projects = [
    {
      title: "Pencil - AI-Powered Flowchart Generator & Editor",
      mobileTitle: "Pencil : Eraser.io killer",
      description:
        "An AI-powered flowchart generator and editor that creates detailed flowcharts from user prompts, allowing for easy customization and export in various formats. It leverages AI to streamline the design process, making it accessible for users of all skill levels.",
      stack: ["React", "React Flow", "TailwindCSS", "Django", "Langchain", "GROQ API"],
      url: "https://pencil-eta.vercel.app/",
      image: "image-4.png",
      mobileImage: "image-4m.png"
    },
    {
      title: "Zaikaa - Django Mobile Booking Web App",
      mobileTitle: "Zaikaa App",
      description:
        "A food ordering application for 'Fun and Fair Systems' that optimizes queue management and handles secure online transactions using Razorpay, driving a 40% year-over-year profit increase. It features multi-role admin panels to manage over 1,000 transactions and 200 active users.",
      stack: ["Django", "HTML", "CSS", "JS", "AWS", "Nginx", "Gunicorn", "PostgreSQL", "Razorpay"],
      url: "https://github.com/Sparky17561/zaikaa",
      image: "image-1.png",
      mobileImage: "image-1m.png"
    },
    {
      title: "ColdCraft - AI-Powered Cold Mail Generator",
      mobileTitle: "ColdCraft",
      description:
        "An AI-powered platform that takes a job URL, scrapes relevant information, and generates a personalized cold email using AI. It integrates with an SMTP server to automatically send the tailored outreach message directly to the HR contact.",
      stack: ["Django", "HTML", "CSS", "JS", "Langchain", "GROQ API", "Firebase"],
      url: "https://github.com/Sparky17561/cold_mail_generator",
      image: "image-2.png",
      mobileImage: "image-2m.png"
    },
    // {
    //   title: "NightLife Personal Portfolio",
    //   mobileTitle: "NightLife Portfolio",
    //   description:
    //     "A visually dynamic and interactive personal portfolio showcasing projects with custom animations and 3D graphics, creating a 'nightlife' aesthetic.",
    //   stack: ["React", "GSAP", "Shaders", "Three.js", "Spline", "Lenis"],
    //   url: "https://github.com/Sparky17561/portfolio",
    //   image: "image-3.png",
    //   mobileImage: "image-3m.png"
    // }
    {
      title: "Pencil - AI-Powered Flowchart Generator & Editor",
      mobileTitle: "Pencil : Eraser.io killer",
      description:
        "An AI-powered flowchart generator and editor that creates detailed flowcharts from user prompts, allowing for easy customization and export in various formats. It leverages AI to streamline the design process, making it accessible for users of all skill levels.",
      stack: ["React", "React Flow", "TailwindCSS", "Django", "Langchain", "GROQ API"],
      url: "https://pencil-eta.vercel.app/",
      image: "image-4.png",
      mobileImage: "image-4m.png"
    }
  ];

  const totalSlides = projects.length;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  // helper to create left-side dark overlay as inline element (kept for desktop; hidden on mobile via CSS)
  const ensureLeftDim = () => {
    const container = document.querySelector(".project-content-overlay");
    if (!container) return;
    let dim = container.querySelector(".project-left-dim");
    if (!dim) {
      dim = document.createElement("div");
      dim.className = "project-left-dim";
      Object.assign(dim.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "1000",
        pointerEvents: "none",
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.68) 28%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.18) 100%)",
        transition: "background 300ms ease"
      });
      container.insertBefore(dim, container.firstChild);
    }
  };

  useEffect(() => {
    // setup once on mount
    ensureLeftDim();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !slideshowRef.current) return;

    // Setup quickTo for link wrapper (parallax)
    if (linkWrapperRef.current) {
      xTo.current = gsap.quickTo(linkWrapperRef.current, "x", {
        duration: 0.6,
        ease: "power3"
      });
      yTo.current = gsap.quickTo(linkWrapperRef.current, "y", {
        duration: 0.6,
        ease: "power3"
      });
      gsap.set(linkWrapperRef.current, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
    }

    // set initial slide positions
    gsap.set(".project-slide", { yPercent: 100 });
    gsap.set("#project-slide-0", { yPercent: 0 });

    // prepare circle path if present
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: 0,
        rotation: -90,
        transformOrigin: "center center"
      });
    }

    // Lenis (or any smooth scroller) integration — more robust (keeps legacy support)
    const lenis = window.lenis || null;
    if (lenis) {
      lenis.on && lenis.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.scrollingElement || document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            try {
              if (typeof lenis.scrollTo === "function") {
                lenis.scrollTo(value, { immediate: true, duration: 0 });
              } else {
                lenis.scrollTo(value);
              }
            } catch (err) {
              window.scrollTo(0, value);
            }
            return;
          }
          return window.scrollY || window.pageYOffset;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: (document.scrollingElement || document.documentElement).style.transform ? "transform" : "fixed"
      });

      ScrollTrigger.addEventListener("refreshInit", () => {
        try {
          lenis && typeof lenis.update === "function" && lenis.update();
        } catch (e) {}
      });
    }

    // build timeline
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });

    // smaller image scale so slide fits well with left dim overlay (desktop)
    for (let i = 0; i < totalSlides; i++) {
      const slideImg = document.querySelector(`#project-slide-${i} img`);
      if (slideImg) gsap.set(slideImg, { scale: 1.08, y: "6%" });
    }

    for (let i = 0; i < totalSlides - 1; i++) {
      tl.to(`#project-slide-${i}`, { yPercent: -100, duration: 1 }, i);
      tl.fromTo(`#project-slide-${i + 1}`, { yPercent: 100 }, { yPercent: 0, duration: 1 }, i);
      tl.fromTo(
        `#project-slide-${i + 1} img`,
        { scale: 1.18, y: "10%" },
        { scale: 1.0, y: "0%", duration: 1 },
        i
      );
      tl.add(() => {
        animateCircle();
        animateText();
      }, i + 0.02);
    }

    let isSnapping = false;
    let st = null;

    const startOffset = NAVBAR_HEIGHT;
    st = ScrollTrigger.create({
      animation: tl,
      trigger: containerRef.current,
      start: `top top+=${startOffset}`,
      end: () => `+=${(window.innerHeight - startOffset) * totalSlides}`,
      pin: slideshowRef.current,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: {
        snapTo: (value) => {
          const step = Math.round(value * (totalSlides - 1)) / (totalSlides - 1);
          return step;
        },
        duration: 0.45,
        ease: "power2.inOut",
        onSnapComplete: (snappedValue) => {
          if (isSnapping) return;
          isSnapping = true;

          try {
            const numericStart = typeof st.start === "number" ? st.start : Number(st.start) || 0;
            const numericEnd =
              typeof st.end === "number"
                ? st.end
                : Number(st.end) || numericStart + (window.innerHeight - startOffset) * totalSlides;

            const absoluteTarget = numericStart + snappedValue * (numericEnd - numericStart);

            if (lenis && typeof lenis.scrollTo === "function") {
              try {
                lenis.scrollTo(absoluteTarget, { immediate: true, duration: 0 });
              } catch (e) {
                window.scrollTo(0, absoluteTarget);
              }
            } else {
              window.scrollTo(0, absoluteTarget);
            }
          } catch (err) {
            // ignore
          } finally {
            setTimeout(() => {
              isSnapping = false;
            }, 60);
          }
        }
      },
      onUpdate(self) {
        const raw = self.progress * (totalSlides - 1);
        const target = Math.round(raw);
        if (target !== currentIndexRef.current) {
          currentIndexRef.current = target;
          // **React state controls the overlay content now**
          setCurrentSlideIndex(target);
          updateIndicators(target);
          updateLink(target);
        }

        const visible = self.progress >= 0 && self.progress <= 1;
        const linkEl = document.querySelector(".project-link");
        const indiEl = document.querySelector(".project-slider-indicator");
        if (linkEl) {
          if (visible) linkEl.classList.add("show");
          else linkEl.classList.remove("show");
        }
        if (indiEl) {
          if (visible) indiEl.classList.add("show");
          else indiEl.classList.remove("show");
        }
      }
    });

    const introTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "top top",
      scrub: 0.6,
      onUpdate(self) {
        if (introRef.current) gsap.set(introRef.current, { yPercent: -self.progress * 100 });
      }
    });

    // initial animations and link update
    updateIndicators(0);
    updateLink(0);

    // setup stack hover handlers (desktop)
    const stackNodes = Array.from(document.querySelectorAll(".project-stack-item"));
    stackItemRefs.current = stackNodes;
    const hoverTweens = new Map();

    stackNodes.forEach((node) => {
      node.style.pointerEvents = "auto";

      const enter = () => {
        if (hoverTweens.has(node)) hoverTweens.get(node).kill();
        const t = gsap.to(node, {
          scale: 1.06,
          boxShadow: "0 8px 30px rgba(255,255,255,0.08)",
          duration: 0.28,
          ease: "power3.out",
          force3D: true
        });
        hoverTweens.set(node, t);
      };
      const leave = () => {
        if (hoverTweens.has(node)) hoverTweens.get(node).kill();
        const t = gsap.to(node, {
          scale: 1,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.28,
          ease: "power3.out"
        });
        hoverTweens.set(node, t);
      };

      node.addEventListener("mouseenter", enter);
      node.addEventListener("mouseleave", leave);

      node.__projListHandlers = { enter, leave };
    });

    const titleEl = titleRef.current;
    let titleAnim = null;
    if (titleEl) {
      titleEl.style.backgroundImage =
        "linear-gradient(90deg,#ffffff 0%,#e5e5e5 25%,#cccccc 50%,#e5e5e5 75%,#ffffff 100%)";
      titleEl.style.backgroundSize = "300% 100%";
      titleEl.style.webkitBackgroundClip = "text";
      titleEl.style.backgroundClip = "text";
      titleEl.style.color = "transparent";

      titleAnim = gsap.to(titleEl, { backgroundPosition: "100% 50%", duration: 7.5, ease: "none", repeat: -1 });
    }

    const refreshHandler = () => {
      try {
        ScrollTrigger.refresh(true);
      } catch (e) {}
    };
    window.addEventListener("resize", refreshHandler);
    window.addEventListener("orientationchange", refreshHandler);

    ScrollTrigger.refresh();

    return () => {
      stackItemRefs.current.forEach((node) => {
        try {
          node.removeEventListener("mouseenter", node.__projListHandlers?.enter);
          node.removeEventListener("mouseleave", node.__projListHandlers?.leave);
          delete node.__projListHandlers;
        } catch (e) {}
      });
      if (titleAnim) titleAnim.kill();
      window.removeEventListener("resize", refreshHandler);
      window.removeEventListener("orientationchange", refreshHandler);
      try {
        st && st.kill && st.kill();
      } catch (e) {}
      tl.kill();
      introTrigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) lenis.off && lenis.off("scroll", ScrollTrigger.update);
      ScrollTrigger.removeEventListener("refreshInit", () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // DOM update helpers (no longer replace text nodes; React controls text content)
  const updateIndicators = (index) => {
    const inds = document.querySelectorAll(".project-index");
    inds.forEach((el, idx) => gsap.to(el, { scaleX: idx === index ? 1 : 0.5, duration: 0.35, ease: "power2.out" }));
  };

  const updateLink = (index) => {
    const project = projects[index];
    const linkElement = document.querySelector(".project-link-wrapper a");
    if (linkElement) linkElement.href = project.url;
  };

  const animateText = () => {
    const t = gsap.timeline();
    if (!line1Ref.current || !line2Ref.current) return t;

    let cur1 = line1Ref.current.querySelector("p");
    let cur2 = line2Ref.current.querySelector("p");

    if (!cur1) {
      cur1 = document.createElement("p");
      cur1.textContent = "View";
      line1Ref.current.appendChild(cur1);
      gsap.set(cur1, { y: 0 });
    }
    if (!cur2) {
      cur2 = document.createElement("p");
      cur2.textContent = "Project";
      line2Ref.current.appendChild(cur2);
      gsap.set(cur2, { y: 0 });
    }

    t.to([cur1, cur2], { y: -30, duration: 0.28, ease: "power2.inOut" })
      .set([cur1, cur2], { y: 30 })
      .to([cur1, cur2], { y: 0, duration: 0.28, ease: "power2.inOut" }, 0.08);

    return t;
  };

  const animateCircle = () => {
    if (!pathRef.current) return gsap.timeline();
    const length = pathRef.current.getTotalLength();
    const t = gsap.timeline();
    t.set(pathRef.current, { strokeDashoffset: 0, strokeDasharray: length })
      .to(pathRef.current, { strokeDashoffset: -length, duration: 0.28, ease: "power2.inOut" })
      .set(pathRef.current, { strokeDashoffset: length })
      .to(pathRef.current, { strokeDashoffset: 0, duration: 0.28, ease: "power2.inOut" });
    return t;
  };

  const handleMouseMove = (e) => {
    if (!linkRef.current || !linkWrapperRef.current) return;
    const xfn = xTo.current,
      yfn = yTo.current;
    if (!xfn || !yfn) return;
    const rect = linkRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    xfn(relX * 0.28);
    yfn(relY * 0.28);
  };

  const handleMouseLeave = () => {
    const xfn = xTo.current,
      yfn = yTo.current;
    if (xfn && yfn) {
      xfn(0);
      yfn(0);
    }
  };

  // initial overlay text for the two small label lines in the circle
  useEffect(() => {
    if (line1Ref.current && !line1Ref.current.querySelector("p")) {
      const p = document.createElement("p");
      p.textContent = "View";
      line1Ref.current.appendChild(p);
    }
    if (line2Ref.current && !line2Ref.current.querySelector("p")) {
      const p = document.createElement("p");
      p.textContent = "Project";
      line2Ref.current.appendChild(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RENDER
  const current = projects[currentSlideIndex];

  return (
    <div className="projects-section" ref={containerRef}>
      <div className="projects-intro" ref={introRef}>
        <h2 className="projects-main-title">Projects</h2>
        <p className="projects-description">A curated selection of my recent work.</p>
      </div>

      <div className="project-slideshow" ref={slideshowRef} aria-label="Project slideshow">
        <div className="project-slider">
          {projects.map((p, i) => {
            // use mobileImage when on mobile and mobileImage exists
            const imgSrc = isMobile && p.mobileImage ? `/images/${p.mobileImage}` : `/images/${p.image}`;
            return (
              <div className="project-slide" id={`project-slide-${i}`} key={i}>
                <img src={imgSrc} alt={p.title} />
              </div>
            );
          })}

          <div className="project-content-overlay">
            <div
              className="project-info"
              style={{
                maxWidth: 520,
                color: "#fff",
                position: "relative",
                zIndex: 1002,
                pointerEvents: "none"
              }}
            >
              <div className="project-title">
                <div ref={titleRef} className="project-title-text" style={{ willChange: "background-position" }}>
                  {isMobile ? current.mobileTitle : current.title}
                </div>
              </div>

              <div className="project-description" style={{ marginTop: 6, pointerEvents: "auto" }}>
                <div
                  className="project-description-text"
                  style={{
                    display: "inline-block",
                    background: "rgba(0,0,0,0.0)",
                    padding: "0",
                    lineHeight: 1.6,
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    whiteSpace: "normal"
                  }}
                >
                  {current.description}
                </div>
              </div>

              <div
                className={`project-stack ${isMobile ? "mobile-hidden" : ""}`}
                style={{ marginTop: 18, display: isMobile ? "none" : "block" }}
              >
                <div className="project-stack-label">Tech Stack</div>
                <div className="project-stack-items" style={{ pointerEvents: "auto" }}>
                  {!isMobile &&
                    current.stack.map((s, idx) => (
                      <span
                        key={idx}
                        className="project-stack-item"
                        style={{
                          display: "inline-block",
                          transformOrigin: "center",
                          transition: "transform 180ms ease",
                          cursor: "pointer",
                          userSelect: "none",
                          pointerEvents: "auto"
                        }}
                      >
                        {s}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="project-slider-indicator" aria-hidden>
          {projects.map((_, i) => (
            <div key={i} className={`project-index ${i === currentSlideIndex ? "active" : ""}`} />
          ))}
        </div>

        <div className="project-link" ref={linkRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} aria-hidden>
          <div className="project-link-wrapper" ref={linkWrapperRef}>
            <a href={current.url} target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 100 100">
                <path ref={pathRef} d="M 50,10 A40,40 0 1,1 49.999,10" stroke="#ffffff" strokeWidth="1" fill="none" />
              </svg>
              <div className="project-link-label">
                <div className="project-line project-line-1" ref={line1Ref}>
                  <p>View</p>
                </div>
                <div className="project-line project-line-2" ref={line2Ref}>
                  <p>Project</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;