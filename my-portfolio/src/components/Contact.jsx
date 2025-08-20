// Contact.jsx
import React from "react";


const LINKS = {
  linkedin: "https://linkedin.com/in/saiprasad",
  instagram: "https://instagram.com/saiprasad",
  github: "https://github.com/saiprasad",
  leetcode: "https://leetcode.com/saiprasad",
};

export default function Contact() {
  const containerRef = React.useRef(null);
  const canvasParentRef = React.useRef(null);
  const animationRef = React.useRef({ raf: null });
  const mouseRef = React.useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = React.useRef({ x: 0.5, y: 0.5 });

  // form refs
  const formRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const messageRef = React.useRef(null);
  const submitBtnRef = React.useRef(null);

  // Enhanced animated background effect
  React.useEffect(() => {
    const parent = canvasParentRef.current;
    if (!parent) return;

    parent.style.position = "relative";
    parent.style.overflow = "hidden";

    // Create canvas for animated background
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "1";
    canvas.style.pointerEvents = "none";
    parent.appendChild(canvas);

    function resize() {
      const DPR = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = parent.clientWidth * DPR;
      canvas.height = parent.clientHeight * DPR;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();

    // Particle system for background animation
    const particles = [];
    const PARTICLE_COUNT = Math.max(40, Math.floor((parent.clientWidth * parent.clientHeight) / 60000));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * parent.clientWidth,
        y: Math.random() * parent.clientHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.3 + 0.08,
      });
    }

    let time = 0;
    function animate() {
      time += 0.015;

      // Clear canvas
      ctx.clearRect(0, 0, parent.clientWidth, parent.clientHeight);

      // Subtle vignette gradient background
      const gradient = ctx.createLinearGradient(0, 0, parent.clientWidth, parent.clientHeight);
      gradient.addColorStop(0, `rgba(0, 255, 136, ${0.03 + Math.sin(time) * 0.01})`);
      gradient.addColorStop(0.6, "rgba(0,0,0,0.55)");
      gradient.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, parent.clientWidth, parent.clientHeight);

      // Mouse influence
      const mouseInfluence = Math.max(80, Math.min(160, parent.clientWidth * 0.12));
      const mouseX = mouseRef.current.x * parent.clientWidth;
      const mouseY = mouseRef.current.y * parent.clientHeight;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Mouse interaction (repel slightly)
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const ang = Math.atan2(dy, dx);
          particle.vx += Math.cos(ang) * force * 0.08;
          particle.vy += Math.sin(ang) * force * 0.08;
        }

        // Natural drift
        particle.vx += Math.sin(time + i) * 0.0005;
        particle.vy += Math.cos(time + i) * 0.0005;

        // Friction
        particle.vx *= 0.995;
        particle.vy *= 0.995;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap-around to keep it soft
        if (particle.x < -10) particle.x = parent.clientWidth + 10;
        if (particle.x > parent.clientWidth + 10) particle.x = -10;
        if (particle.y < -10) particle.y = parent.clientHeight + 10;
        if (particle.y > parent.clientHeight + 10) particle.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,255,136,${0.09 * (1 - d / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Add floating title effect (subtle)
      ctx.font = "700 36px Inter, sans-serif";
      ctx.fillStyle = `rgba(234, 254, 243, ${0.06 + Math.sin(time * 2) * 0.02})`;
      ctx.textAlign = "center";
      const tx = parent.clientWidth / 2;
      const ty = parent.clientHeight / 2 + Math.sin(time * 3) * 8;
      ctx.fillText("Contact", tx, ty);

      // request next frame
      animationRef.current.raf = requestAnimationFrame(animate);
    }
    animate();

    // Mouse handlers (smooth interpolation applied in move)
    function onMove(e) {
      const rect = parent.getBoundingClientRect();
      targetMouseRef.current.x = (e.clientX - rect.left) / rect.width;
      targetMouseRef.current.y = (e.clientY - rect.top) / rect.height;
      // smooth update loop
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.12;
    }

    function onEnter(e) {
      onMove(e);
    }

    function onLeave() {
      targetMouseRef.current.x = 0.5;
      targetMouseRef.current.y = 0.5;
    }

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      if (animationRef.current.raf) {
        cancelAnimationFrame(animationRef.current.raf);
      }
      if (parent.contains(canvas)) {
        parent.removeChild(canvas);
      }
    };
  }, []);

  // Entry animations + input micro interactions
  React.useEffect(() => {
    if (!containerRef.current) return;

    // staggered entrance
    const left = containerRef.current.querySelector(".contact-left");
    const right = containerRef.current.querySelector(".contact-right");
    [left, right].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translateY(${20 + i * 6}px)`;
      setTimeout(() => {
        el.style.transition = "opacity 0.55s cubic-bezier(.2,.9,.2,1), transform 0.55s cubic-bezier(.2,.9,.2,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 120 + i * 80);
    });

    // focus/blur micro interaction - use delegation
    const formEl = formRef.current;
    if (!formEl) return;
    function onFocus(e) {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      el.classList.add("is-focused");
    }
    function onBlur(e) {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      el.classList.remove("is-focused");
    }

    formEl.addEventListener("focusin", onFocus);
    formEl.addEventListener("focusout", onBlur);

    return () => {
      formEl.removeEventListener("focusin", onFocus);
      formEl.removeEventListener("focusout", onBlur);
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const message = messageRef.current.value.trim();

    if (!name || !email || !message) {
      // subtle shake
      const form = formRef.current;
      form.style.animation = "shake 0.36s ease-in-out";
      setTimeout(() => (form.style.animation = ""), 360);
      return;
    }

    const btn = submitBtnRef.current;
    const originalHTML = btn.innerHTML;

    // tactile press
    btn.style.transform = "translateY(1px) scale(0.995)";
    btn.disabled = true;
    btn.innerHTML = "Sending...";
    btn.classList.add("sending");

    setTimeout(() => {
      btn.innerHTML = "Sent ✓";
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.classList.remove("sending");
        btn.style.transform = "";
      }, 1400);
    }, 900);
  }

  return (
    <section
      id="contact"
      className="contact-section"
      ref={containerRef}
      aria-labelledby="contact-heading"
      style={{ background: "linear-gradient(180deg,#060706 0%, #000 100%)" }}
    >
      <div className="contact-inner">
        {/* LEFT - animated canvas + centered title */}
        <div className="contact-left" aria-hidden="false">
          <div className="webgl-wrap" ref={canvasParentRef}>
            {/* Canvas animation will be injected here */}
            <div className="gl-overlay" role="presentation" aria-hidden="true">
              <div id="contact-title" className="contact-title">
                Contact
              </div>
              <div className="contact-sub">Let's build something amazing together</div>
            </div>
          </div>
        </div>

        {/* RIGHT - sleek form */}
        <div className="contact-right" aria-hidden="false">
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <h3 id="contact-heading" className="form-heading">Get in touch</h3>

            <label className="field">
              <span className="label-text">Name</span>
              <input
                ref={nameRef}
                name="name"
                type="text"
                className="input"
                placeholder=" "
                aria-label="Your name"
                required
              />
            </label>

            <label className="field">
              <span className="label-text">Email</span>
              <input
                ref={emailRef}
                name="email"
                type="email"
                className="input"
                placeholder=" "
                aria-label="Your email"
                required
              />
            </label>

            <label className="field">
              <span className="label-text">Message</span>
              <textarea
                ref={messageRef}
                name="message"
                className="textarea"
                rows="5"
                placeholder=" "
                aria-label="Your message"
                required
              />
            </label>

            <div className="form-actions">
              <button ref={submitBtnRef} className="btn-primary" type="submit">
                <span className="btn-text">Send</span>
                <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M2 12L22 3L15 22L11 13L2 12Z" fill="currentColor"/>
                </svg>
              </button>

              <div className="contact-meta">
                <nav className="socials" aria-label="Social links">
                  <a className="social-link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                    {/* svg icons kept small */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  <a className="social-link" href={LINKS.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  <a className="social-link" href={LINKS.github} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>

                  <a className="social-link" href={LINKS.leetcode} target="_blank" rel="noopener noreferrer" title="LeetCode" aria-label="LeetCode">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.813 2.133 8.021-.069 2.33-2.237 2.304-5.75.073-8.012l-4.138-4.175a.199.199 0 0 1-.058-.137.188.188 0 0 1 .058-.138l1.45-1.45a.18.18 0 0 1 .257.006l4.283 4.258c1.821 1.8 1.821 4.72 0 6.52a4.93 4.93 0 0 1-6.888 0L12.39 17.17a.756.756 0 0 1-.218-.53.707.707 0 0 1 .218-.531l1.215-1.188a.757.757 0 0 1 1.078 0l.45.451a1.69 1.69 0 0 0 2.395 0 1.701 1.701 0 0 0 0-2.402L12.81 8.24a1.59 1.59 0 0 0-2.257 0L5.92 12.862c-.22.22-.22.578 0 .798l4.138 4.138a.757.757 0 0 1 0 1.078.757.757 0 0 1-1.078 0l-4.138-4.138a2.187 2.187 0 0 1 0-3.102L9.474 7.004a3.02 3.02 0 0 1 4.283 0l4.638 4.638a.353.353 0 0 0 .499 0 .35.35 0 0 0 0-.499L14.256 6.505a1.373 1.373 0 0 0-.478-.332 1.378 1.378 0 0 0-.544-.11 1.378 1.378 0 0 0-.978.438l-1.45 1.45a1.187 1.187 0 0 0-.348.843 1.187 1.187 0 0 0 .348.843l4.138 4.175c1.374 1.374 1.374 3.6 0 4.973-1.374 1.374-3.6 1.374-4.974 0L5.843 14.647a2.187 2.187 0 0 1 0-3.102L10.474 7.004a1.373 1.373 0 0 1 .961-.438 1.373 1.373 0 0 1 .978.438l4.638 4.638c.22.22.578.22.798 0 .22-.22.22-.578 0-.798L13.211.438a1.374 1.374 0 0 0-.961-.438h.233z"/>
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
