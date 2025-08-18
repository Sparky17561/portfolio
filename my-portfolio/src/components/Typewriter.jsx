import React, { useState, useEffect } from "react";

// Typewriter Component
export default function Typewriter({ sentences }) {
  const [text, setText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < sentences[sentenceIndex].length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + sentences[sentenceIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      }, 1500);
      return () => clearTimeout(pause);
    }
  }, [charIndex, sentenceIndex, sentences]);

  return (
    <div className="typewriter-container">
      <p className="typewriter-text">
        {text}
        <span className="typewriter-caret" />
      </p>
    </div>
  );
}
