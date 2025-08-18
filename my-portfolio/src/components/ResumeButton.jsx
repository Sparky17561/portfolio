import React, { useState } from "react";

// Resume Button Component that matches your existing structure
export default function ResumeButton({ href = "/resume.pdf" }) {
  return (
    <div className="resume-btn-wrapper">
      <a href={href} className="resume-btn">
        Resume
      </a>
    </div>
  );
}