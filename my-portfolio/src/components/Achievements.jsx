import React, { useState, useEffect, useRef } from 'react';


const Achievements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const achievements = [
    {
      id: 1,
      title: "Gamethon 2K25",
      description: "Won first place at the Inter-College Game Development using AI Hackathon",
      image: "/images/achievement1.jpg",
      linkedinPost: "https://www.linkedin.com/posts/ugcPost-7312073781827592192-g5t6?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_9CmQBaKpho7VahiwxaLLmRw0aF3ggvC8",
      category: "Competition"
    },
    {
      id: 2,
      title: "Computer Engineering Branch Topper 2K22",
      description: "Secured Rank 1 among 180 Students of Computer Science Branch",
      image: "/images/achievement2.jpg",
      linkedinPost: "https://www.linkedin.com/posts/saiprasad-jamdar_securing-rank-1-in-my-computer-engineering-activity-7203982548299849728--Pb2?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_9CmQBaKpho7VahiwxaLLmRw0aF3ggvC8",
      category: "Recognition"
    },
   
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

  const handleViewAchievement = (linkedinPost) => {
    window.open(linkedinPost, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="achievements-section" ref={sectionRef}>
      <div className="achievements-container">
        <div className="achievements-header">
          <div className="section-badge">
            <span>🏆</span>
          </div>
          <h2 className="section-title">
            <span className="title-line">My</span>
            <span className="title-highlight">Achievements</span>
          </h2>
          <p className="section-subtitle">
            Milestones and recognitions that define my journey in technology
          </p>
        </div>

        <div className={`achievements-grid ${isVisible ? 'animate-in' : ''}`}>
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.id} 
              className="achievement-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="achievement-image-container">
                <img 
                  src={achievement.image} 
                  alt={achievement.title}
                  className="achievement-image"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <span className="achievement-category">{achievement.category}</span>
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                </div>
                <div className="card-glow"></div>
              </div>
              
              <div className="achievement-actions">
                <button 
                  className="view-btn"
                  onClick={() => handleViewAchievement(achievement.linkedinPost)}
                  aria-label={`View ${achievement.title} on LinkedIn`}
                >
                  <span className="btn-text">View Post</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Achievements;