// AboutUs.jsx - Left paragraph with right image layout
import React, { useEffect, useRef, useCallback, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const RAW_PARAGRAPH = `Hi — I’m Saiprasad_Jamdar. I build Backend systems, AI applications and ship full-stack products that solve real problems. Gamethon2k25 winner and FYTopper; I mentor peers and enjoy competitive_programming. Let's Connect and make something Awesome`;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeHighlightedHtml(text, highlights = []) {
  if (!highlights || highlights.length === 0) return text;
  const words = [...highlights].filter(Boolean).sort((a, b) => b.length - a.length);
  let out = text;
  for (const w of words) {
    const pattern = new RegExp(`\\b${escapeRegex(w)}\\b`, "gi");
    out = out.replace(pattern, (match) => `<span class="highlight">${match}</span>`);
  }
  return out;
}

export default function AboutUs({ highlights = ["SaiprasadJamdar", "VibeCoding", "DSA", "Gamethon2k25", "FYTopper"] }) {
  const rootRef = useRef(null);
  const paraRef = useRef(null);
  const imageRef = useRef(null); // container element that holds the image stack
  const splitRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [isActive, setIsActive] = useState(false); // controls crossfade state

  // change these source paths to your actual image filenames
  const FRONT_IMAGE = "/images/portfolio_img.jpg";
  const BACK_IMAGE = "/images/portfolio_img_2.jpg";

  const cleanupAnimation = useCallback(() => {
    if (scrollTriggerRef.current) {
      try {
        scrollTriggerRef.current.kill();
      } catch (e) {}
      scrollTriggerRef.current = null;
    }
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === rootRef.current) {
        try { trigger.kill(); } catch (e) {}
      }
    });
    if (splitRef.current && splitRef.current.revert) {
      try {
        splitRef.current.revert();
      } catch (e) {
        console.warn("Error reverting SplitType:", e);
      }
      splitRef.current = null;
    }
  }, []);

  const setupAnimation = useCallback(() => {
    if (!rootRef.current || !paraRef.current) return;

    const html = makeHighlightedHtml(RAW_PARAGRAPH, highlights);
    paraRef.current.innerHTML = html;

    requestAnimationFrame(() => {
      // Split text into words
      const split = new SplitType(paraRef.current, {
        types: "words",
        tagName: "span",
        splitClass: "",
        wordClass: "word"
      });

      splitRef.current = split;
      if (!split.words || split.words.length === 0) return;

      // Identify highlighted words and apply classes
      split.words.forEach((word) => {
        word.style.cssText = `
          display: inline;
          margin-right: 0.35em;
          color: #666666;
        `;

        // Check if word contains highlighted content
        if (word.querySelector('.highlight') || 
            word.classList.contains('highlight') ||
            word.innerHTML.includes('class="highlight"') ||
            highlights.some(h => word.textContent.toLowerCase().includes(h.toLowerCase()))) {
          word.classList.add('word-highlight');
        }
      });

      // Create scroll-triggered animation
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        end: "top -30%",
        scrub: 8,
        onUpdate: (self) => {
          const progress = self.progress;
          const wordsToReveal = Math.floor(progress * split.words.length);

          // Reveal words progressively
          split.words.forEach((word, index) => {
            if (index < wordsToReveal) {
              if (word.classList.contains('word-highlight')) {
                word.classList.add('revealed');
                word.style.color = '#00ff88';
                word.style.textShadow = `
                  0 0 16px rgba(0,255,136,0.6),
                  0 0 32px rgba(0,255,136,0.3)
                `;
              } else {
                word.classList.add('revealed');
                word.style.color = '#ffffff';
              }
            } else {
              word.classList.remove('revealed');
              word.style.color = '#666666';
              word.style.textShadow = 'none';
            }
          });
        }
      });

      scrollTriggerRef.current = st;

      // Image animation (animate the container so image stack fades in together)
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, 
          {
            opacity: 0,
            scale: 0.92,
            y: 40
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Refresh ScrollTrigger
      gsap.delayedCall(0.1, () => {
        ScrollTrigger.refresh();
      });
    });
  }, [highlights]);

  useEffect(() => {
    cleanupAnimation();
    const timeoutId = setTimeout(setupAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      cleanupAnimation();
    };
  }, [highlights, cleanupAnimation, setupAnimation]);

  // Preload back image for a seamless hover swap
  useEffect(() => {
    if (!BACK_IMAGE) return;
    const i = new Image();
    i.src = BACK_IMAGE;
  }, []); // run once

  // click animation (tactile)
  const handleImageClick = useCallback(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 0.96,
        duration: 0.09,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  }, []);

  // keyboard: preview alternate image briefly on Enter/Space
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // show alt image briefly
      setIsActive(true);
      handleImageClick();
      const t = setTimeout(() => setIsActive(false), 700);
      return () => clearTimeout(t);
    }
  }, [handleImageClick]);

  const handleImageError = useCallback((e) => {
    console.warn("Image failed to load:", e?.target?.src);
    if (e?.target) e.target.style.display = 'none';
  }, []);

  return (
    <section className="aboutus-section" ref={rootRef}>
      <div className="aboutus-inner">
        <h2 className="aboutus-title">About me</h2>

        <div className="aboutus-content">
          <div className="aboutus-text">
            <p className="fade-text" ref={paraRef} aria-live="polite">
              {RAW_PARAGRAPH}
            </p>
            
            <div className="aboutus-small">
              <p>A developer passionate about creating meaningful digital experiences. </p>
            </div>
          </div>

          <div className="aboutus-image">
            <div 
              className={`profile-image-container ${isActive ? 'active' : ''}`}
              ref={imageRef}
              onClick={() => { setIsActive(v => !v); handleImageClick(); }}
              onMouseEnter={() => setIsActive(true)}
              onMouseLeave={() => setIsActive(false)}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Profile photo of Saiprasad Jamdar. Hover or focus to preview alternate image."
              aria-pressed={isActive}
            >
              <div className="image-stack" aria-hidden="false">
                {/* back image (alternate) */}
                <img 
                  className="profile-image profile-image--back"
                  src={BACK_IMAGE}
                  alt="Saiprasad Jamdar - alternate"
                  loading="eager"
                  onError={handleImageError}
                  draggable={false}
                />
                {/* front image (default) */}
                <img 
                  className="profile-image profile-image--front"
                  src={FRONT_IMAGE}
                  alt="Saiprasad Jamdar - Developer and Designer"
                  loading="lazy"
                  onError={handleImageError}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
