import React from "react";

export default function ResumeButton({
  href = "/Saiprasad_Ulhas_Jamdar_Resume.pdf",
  children = "Resume",
}) {
  const handleClick = (e) => {
    // prevent SPA/router from hijacking the anchor
    e.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="resume-btn-wrapper">
      <a
        href={href}
        className="resume-btn"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {children}
      </a>
    </div>
  );
}
