// AboutUs.jsx - Block paragraph with scroll color animation
import React, { useEffect, useRef, useCallback } from "react";
import "./aboutus.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const RAW_PARAGRAPH = `Hi — I’m SaiprasadJamdar. I like designing, video editing, VibeCoding (I vibecoded this :) ) and building cool projects; I also do DSA (proud nerd over here). I’ve won Gamethon2k25, was a FYTopper, and mentor classmates on campus. Open to internships and collabs — let’s build something awesome.`;

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

export default function AboutUs({ highlights = ["Saiprasad_Jamdar", "front-end", "ML", "DSA", "Gamethon2k25"] }) {
  const rootRef = useRef(null);
  const paraRef = useRef(null);
  const splitRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const cleanupAnimation = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === rootRef.current) trigger.kill();
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
      const regularWords = [];
      const highlightedWords = [];

      split.words.forEach((word) => {
        word.style.cssText = `
          display: inline;
          margin-right: 0.4em;
          color: #666666;
        `;

        // Check if word contains highlighted content
        if (word.querySelector('.highlight') || 
            word.classList.contains('highlight') ||
            word.innerHTML.includes('class="highlight"') ||
            highlights.some(h => word.textContent.toLowerCase().includes(h.toLowerCase()))) {
          highlightedWords.push(word);
          word.classList.add('word-highlight');
        } else {
          regularWords.push(word);
        }
      });

      // Create scroll-triggered animation
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 65%", // Start very early
        end: "top -25%", // End very quickly
        scrub: 10, // Super fast animation
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

  return (
    <section className="aboutus-section" ref={rootRef}>
      <div className="aboutus-inner">
        <h2 className="aboutus-title">About me</h2>

        <div className="aboutus-text">
          <p className="fade-text" ref={paraRef} aria-live="polite">
            {RAW_PARAGRAPH}
          </p>
        </div>

        <div className="aboutus-small">
          <p>A developer passionate about creating meaningful digital experiences. Currently seeking internships and collaboration opportunities.</p>
        </div>
      </div>
    </section>
  );
}