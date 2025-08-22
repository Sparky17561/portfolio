import React, { useState, useEffect, useRef } from 'react';


const Education = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const educationData = [
    {
      id: 1,
      level: "Bachelor's Degree",
      degree: "B.Tech in Computer Engineering",
      institution: "Shah and Anchor Kutchhi Engineering College",
      location: "Chembur, Mumbai",
      year: "2022-2026 (Expected)",
      score: "9.11 CGPA",
      scoreLabel: "Semester 6 Aggregate",
      icon: "🎓",
      status: "ongoing",
      highlights: ["Computer Engineering", "Current Student", "High Academic Performance"]
    },
    {
      id: 2,
      level: "Bachelor's Degree",
      degree: "BS in Data Science",
      institution: "Indian Institute of Technology, Madras",
      location: "Online Program",
      year: "2024-2028 (Expected)",
      score: "7.7 CGPA",
      scoreLabel: "Current CGPA",
      icon: "💻",
      status: "ongoing",
      highlights: ["Data Science", "IIT Madras", "Online Learning"]
    },
    {
      id: 3,
      level: "Higher Secondary",
      degree: "12th Standard - Science",
      institution: "BK Birla College of Commerce, Science & Arts",
      location: "Mumbai",
      year: "2022",
      score: "75%",
      scoreLabel: "Percentage",
      icon: "📚",
      status: "completed",
      highlights: ["Science Stream", "Physics, Chemistry, Mathematics", "College Preparation"]
    },
    {
      id: 4,
      level: "Secondary",
      degree: "10th Standard",
      institution: "Sri Vani Vidyashala High School",
      location: "Kalyan, Mumbai",
      year: "2020",
      score: "92%",
      scoreLabel: "Percentage",
      icon: "🏫",
      status: "completed",
      highlights: ["Strong Foundation", "Academic Excellence", "All Subjects"]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="education-section" ref={sectionRef}>
      <div className="education-container">
        <div className="education-header">
          <div className="section-badge">
            <span>🎓</span>
          </div>
          <h2 className="section-title">
            <span className="title-line">Educational</span>
            <span className="title-highlight">Journey</span>
          </h2>
          <p className="section-subtitle">
            Building knowledge and expertise through formal education and continuous learning
          </p>
        </div>

        <div className={`education-timeline ${isVisible ? 'animate-in' : ''}`}>
          {educationData.map((edu, index) => (
            <div 
              key={edu.id} 
              className={`education-item ${edu.status}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="timeline-connector">
                <div className="timeline-dot">
                  <span className="dot-icon">{edu.icon}</span>
                </div>
                {index < educationData.length - 1 && <div className="timeline-line"></div>}
              </div>

              <div className="education-card">
                <div className="card-header">
                  <div className="education-meta">
                    <span className="education-level">{edu.level}</span>
                    <span className={`education-status ${edu.status}`}>
                      {edu.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  </div>
                  <div className="education-year">{edu.year}</div>
                </div>

                <div className="card-content">
                  <h3 className="education-degree">{edu.degree}</h3>
                  <div className="institution-info">
                    <h4 className="institution-name">{edu.institution}</h4>
                    <p className="institution-location">{edu.location}</p>
                  </div>

                  <div className="score-section">
                    <div className="score-display">
                      <span className="score-value">{edu.score}</span>
                      <span className="score-label">{edu.scoreLabel}</span>
                    </div>
                  </div>

                  <div className="education-highlights">
                    {edu.highlights.map((highlight, idx) => (
                      <span key={idx} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-glow"></div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Education;