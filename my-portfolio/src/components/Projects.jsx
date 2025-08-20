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
      title: "Zaikaa - Django Mobile Booking Web App",
      mobileTitle: "Zaikaa App",
      description: "A food ordering application for 'Fun and Fair Systems' that optimizes queue management and handles secure online transactions using Razorpay, driving a 40% year-over-year profit increase. It features multi-role admin panels to manage over 1,000 transactions and 200 active users.",
      mobileDescription: "Food ordering app with queue optimization and secure payments via Razorpay.",
      stack: ["Django", "HTML", "CSS", "JS", "AWS", "Nginx", "Gunicorn", "PostgreSQL", "Razorpay"],
      url: "#",
      image: "image-1.png"
    },
    {
      title: "ColdCraft - AI-Powered Cold Mail Generator",
      mobileTitle: "ColdCraft",
      description: "An AI-powered platform that takes a job URL, scrapes relevant information, and generates a personalized cold email using AI. It integrates with an SMTP server to automatically send the tailored outreach message directly to the HR contact.",
      mobileDescription: "AI platform that generates personalized cold emails from job URLs and sends them automatically.",
      stack: ["Django", "HTML", "CSS", "JS", "Langchain", "GROQ API", "Firebase"],
      url: "#",
      image: "image-2.png"
    },
    {
      title: "Analytics Dashboard",
      mobileTitle: "Analytics Dashboard",
      description: "Interactive data visualization platform with real-time analytics and comprehensive reporting features for business intelligence.",
      mobileDescription: "Interactive data visualization platform with real-time analytics.",
      stack: ["React", "D3.js"],
      url: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&crop=center",
    },
    {
      title: "Mobile Banking App",
      mobileTitle: "Banking App",
      description: "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.",
      mobileDescription: "Secure mobile banking app with biometric authentication and real-time transactions.",
      stack: ["React Native", "Firebase"],
      url: "#",
      image: "https://images.unsplash.com/photo-1521791136060-8f3c1b2d4c5f?w=1200&h=800&fit=crop&crop=center",
    },
    {
      title: "E-Commerce Platform",
      mobileTitle: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with advanced inventory management, payment processing, and customer analytics dashboard.",
      mobileDescription: "Full-stack e-commerce solution with inventory management and payment processing.",
      stack: ["React", "Node.js", "MongoDB"],
      url: "#",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&crop=center",
    },
    {
      title: "Task Management App",
      mobileTitle: "Task Manager",
      description: "Collaborative project management platform with team coordination, deadline tracking, and productivity analytics for enhanced workflow optimization.",
      mobileDescription: "Collaborative project management platform with team coordination and deadline tracking.",
      stack: ["Vue.js", "Express"],
      url: "#",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop&crop=center",
    },
  ];

  const totalSlides = projects.length;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  // helper to create left-side dark overlay as inline element (no CSS changes)
  const ensureLeftDim = () => {
    const container = document.querySelector(".project-content-overlay");
    if (!container) return;
    let dim = container.querySelector(".project-left-dim");
    if (!dim) {
      dim = document.createElement("div");
      dim.className = "project-left-dim";
      // inline styles so we don't touch your CSS file
      Object.assign(dim.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "1000", // below content which we set to higher
        pointerEvents: "none",
        // stronger dark gradient for better contrast for left text
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.68) 28%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.18) 100%)",
        transition: "background 300ms ease",
      });
      // insert as first child
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
        ease: "power3",
      });
      yTo.current = gsap.quickTo(linkWrapperRef.current, "y", {
        duration: 0.6,
        ease: "power3",
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
        transformOrigin: "center center",
      });
    }

    // Lenis (or any smooth scroller) integration — more robust
    const lenis = window.lenis || null;
    if (lenis) {
      lenis.on && lenis.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.scrollingElement || document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            try {
              // prefer an immediate/zero-duration call if lenis supports options
              if (typeof lenis.scrollTo === "function") {
                // best-effort immediate call — some lenis versions accept an options object
                // using try/catch because different lenis versions vary
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
        pinType: (document.scrollingElement || document.documentElement).style.transform ? "transform" : "fixed",
      });

      // keep lenis in-sync on refresh
      ScrollTrigger.addEventListener("refreshInit", () => {
        try {
          lenis && typeof lenis.update === "function" && lenis.update();
        } catch (e) {}
      });
    }

    // build timeline
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });

    // smaller image scale so slide fits well with left dim overlay
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
      tl.add(
        () => {
          animateCircle();
          animateText();
        },
        i + 0.02
      );
    }

    // small guard to prevent duplicate snap-handling interactions
    let isSnapping = false;
    // we'll store the ScrollTrigger instance here so snap callback can compute absolute positions
    let st = null;

    // IMPORTANT: account for navbar height so the pinned slideshow sits under the navbar without layout hacks
    const startOffset = NAVBAR_HEIGHT;
    st = ScrollTrigger.create({
      animation: tl,
      trigger: containerRef.current,
      // start when top of container reaches top + navbar height
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
        },
      },
      onUpdate(self) {
        const raw = self.progress * (totalSlides - 1);
        const target = Math.round(raw);
        if (target !== currentIndexRef.current) {
          currentIndexRef.current = target;
          setCurrentSlideIndex(target);
          updateProjectInfo(target);
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
      },
    });

    // Intro upward movement as user enters section
    const introTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "top top",
      scrub: 0.6,
      onUpdate(self) {
        if (introRef.current) gsap.set(introRef.current, { yPercent: -self.progress * 100 });
      },
    });

    // initial overlay content & indicator setup
    updateProjectInfo(0);
    updateIndicators(0);
    updateLink(0);

    // Micro interactions: attach handlers for stack items (GSAP-based)
    const stackNodes = Array.from(document.querySelectorAll(".project-stack-item"));
    stackItemRefs.current = stackNodes;
    const hoverTweens = new Map();

    stackNodes.forEach((node) => {
      // ensure pointer events enabled on items (they were pointer-events: none by overlay)
      node.style.pointerEvents = "auto";

      const enter = () => {
        // kill any existing reverse tween
        if (hoverTweens.has(node)) hoverTweens.get(node).kill();
        const t = gsap.to(node, {
          scale: 1.06,
          boxShadow: "0 8px 30px rgba(255,255,255,0.08)",
          duration: 0.28,
          ease: "power3.out",
          force3D: true,
        });
        hoverTweens.set(node, t);
      };
      const leave = () => {
        if (hoverTweens.has(node)) hoverTweens.get(node).kill();
        const t = gsap.to(node, {
          scale: 1,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.28,
          ease: "power3.out",
        });
        hoverTweens.set(node, t);
      };

      node.addEventListener("mouseenter", enter);
      node.addEventListener("mouseleave", leave);

      // store cleanup info on the node
      node.__projListHandlers = { enter, leave };
    });

    // handle gradient shifter for title (ensures gradient shows even if CSS fails)
    const titleEl = titleRef.current;
    let titleAnim = null;
    if (titleEl) {
      // apply inline gradient styles (white to grey) and clip
      titleEl.style.backgroundImage = "linear-gradient(90deg,#ffffff 0%,#e5e5e5 25%,#cccccc 50%,#e5e5e5 75%,#ffffff 100%)";
      titleEl.style.backgroundSize = "300% 100%";
      titleEl.style.webkitBackgroundClip = "text";
      titleEl.style.backgroundClip = "text";
      titleEl.style.color = "transparent";

      // animate background-position to produce moving gradient
      titleAnim = gsap.to(titleEl, { backgroundPosition: "100% 50%", duration: 7.5, ease: "none", repeat: -1 });
    }

    // Refresh on resize/orientation to avoid miscomputed heights which can cause snapping glitches
    const refreshHandler = () => {
      try {
        ScrollTrigger.refresh(true);
      } catch (e) {}
    };
    window.addEventListener("resize", refreshHandler);
    window.addEventListener("orientationchange", refreshHandler);

    // force a refresh so scrollerProxy and lengths are accurate
    ScrollTrigger.refresh();

    // cleanup
    return () => {
      // remove stack handlers
      stackItemRefs.current.forEach((node) => {
        try {
          node.removeEventListener("mouseenter", node.__projListHandlers?.enter);
          node.removeEventListener("mouseleave", node.__projListHandlers?.leave);
          delete node.__projListHandlers;
        } catch (e) {}
      });
      // kill tweens/anim
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
  }, []);

  // DOM update helpers
  const updateProjectInfo = (slideIndex) => {
    const project = projects[slideIndex];
    gsap.to([".project-title-text", ".project-description-text", ".project-stack-items"], {
      y: -28,
      opacity: 0,
      duration: 0.28,
      ease: "power2.inOut",
      onComplete: () => {
        const titleEl = document.querySelector(".project-title-text");
        const descEl = document.querySelector(".project-description-text");
        const stackEl = document.querySelector(".project-stack-items");
        
        if (titleEl) {
          titleEl.textContent = isMobile ? project.mobileTitle : project.title;
        }
        
        if (descEl) {
          descEl.textContent = isMobile ? project.mobileDescription : project.description;
        }
        
        if (stackEl) {
          if (isMobile) {
            // Hide stack on mobile
            stackEl.style.display = 'none';
          } else {
            // Show stack on desktop
            stackEl.style.display = 'flex';
            stackEl.innerHTML = "";
            project.stack.forEach((s) => {
              const span = document.createElement("span");
              span.className = "project-stack-item";
              span.textContent = s;
              // pointer events enabled so micro interactions work
              span.style.pointerEvents = "auto";
              stackEl.appendChild(span);
            });
          }
        }

        // reattach micro interactions for new stack items (only on desktop)
        if (!isMobile) {
          requestAnimationFrame(() => {
            const newStackNodes = Array.from(document.querySelectorAll(".project-stack-item"));
            // simple micro interaction: scale on hover using gsap
            newStackNodes.forEach((node) => {
              node.onmouseenter = () => gsap.to(node, { scale: 1.06, boxShadow: "0 8px 30px rgba(255,255,255,0.08)", duration: 0.22 });
              node.onmouseleave = () => gsap.to(node, { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.22 });
            });
          });
        }

        gsap.fromTo(
          [".project-title-text", ".project-description-text", ".project-stack-items"],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.06 }
        );
      },
    });
  };

  const updateIndicators = (index) => {
    const inds = document.querySelectorAll(".project-index");
    inds.forEach((el, idx) => gsap.to(el, { scaleX: idx === index ? 1 : 0.5, duration: 0.35, ease: "power2.out" }));
  };

  const updateLink = (index) => {
    const project = projects[index];
    const linkElement = document.querySelector(".project-link-wrapper a");
    if (linkElement) linkElement.href = project.url;
  };

  // UPDATED animateText: reuse existing <p> nodes (no appends on each run)
  const animateText = () => {
    const t = gsap.timeline();
    if (!line1Ref.current || !line2Ref.current) return t;

    // find existing nodes; create only if missing (edge cases)
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

    // animate the same nodes out and back in (no DOM mutations)
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

  // initial overlay content
  useEffect(() => {
    // ensure the circular link has its <p> nodes once at mount (prevents duplicates later)
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

    updateProjectInfo(0);
    updateIndicators(0);
    updateLink(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <div className="projects-section" ref={containerRef}>
      <div className="projects-intro" ref={introRef}>
        <h2 className="projects-main-title">Projects</h2>
        <p className="projects-description">A curated selection of my recent work.</p>
      </div>

      <div className="project-slideshow" ref={slideshowRef} aria-label="Project slideshow">
        <div className="project-slider">
          {projects.map((p, i) => (
            <div className="project-slide" id={`project-slide-${i}`} key={i}>
              <img src={`/images/${p.image}`} alt={p.title} />
            </div>
          ))}

          {/* content overlay: we keep CSS, but add extra structure so paragraph sits inside a visible block */}
          <div className="project-content-overlay" style={{ position: "absolute" }}>
            {/* left dim is injected by ensureLeftDim() to avoid changing CSS file */}
            <div
              className="project-info"
              style={{
                maxWidth: 520,
                color: "#fff",
                position: "relative",
                zIndex: 1002, // above injected left dim
                pointerEvents: "none",
              }}
            >
              <div className="project-title">
                {/* assign ref to title so we can apply inline gradient and animation */}
                <div ref={titleRef} className="project-title-text" style={{ willChange: "background-position" }}>
                  {isMobile ? projects[0].mobileTitle : projects[0].title}
                </div>
              </div>

              {/* The paragraph wrapper that visually sits in the dark overlay
                  we use inline styles so the paragraph 'sticks' to the dark area */
              }
              <div
                className="project-description"
                style={{
                  marginTop: 6,
                  pointerEvents: "auto", // allow selection if needed
                }}
              >
                <div
                  className="project-description-text"
                  style={{
                    display: "inline-block",
                    background: "rgba(0,0,0,0.0)", // text sits over the injected dim
                    padding: "0 0 0 0",
                    lineHeight: 1.6,
                    // ensure the paragraph wraps nicely and doesn't overflow
                    maxWidth: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  {isMobile ? projects[0].mobileDescription : projects[0].description}
                </div>
              </div>

              <div className={`project-stack ${isMobile ? 'mobile-hidden' : ''}`} style={{ marginTop: 18, display: isMobile ? 'none' : 'block' }}>
                <div className="project-stack-label">Tech Stack</div>
                <div
                  className="project-stack-items"
                  // allow pointer events on stack container so chips can be hovered
                  style={{ pointerEvents: "auto" }}
                >
                  {!isMobile && projects[0].stack.map((s, idx) => (
                    <span
                      key={idx}
                      className="project-stack-item"
                      // small inline style to make chips more interactive and visually consistent
                      style={{
                        display: "inline-block",
                        transformOrigin: "center",
                        transition: "transform 180ms ease",
                        cursor: "pointer",
                        userSelect: "none",
                        pointerEvents: "auto",
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
            <div key={i} className={`project-index ${i === 0 ? "active" : ""}`} />
          ))}
        </div>

        <div className="project-link" ref={linkRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} aria-hidden>
          <div className="project-link-wrapper" ref={linkWrapperRef}>
            <a href={projects[0].url} target="_blank" rel="noreferrer">
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