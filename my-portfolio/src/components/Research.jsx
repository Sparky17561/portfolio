import React, { useState, useEffect, useRef } from 'react';


const Research = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sectionRef = useRef(null);

  const researchPapers = [
    {
      id: 1,
      title: "Potentially Hazardous Asteroid Prediction using Adaboost over Linear Regression",
      journal: "Journal of Information Systems Engineering & Management",
      year: "2025",
      category: "Machine Learning",
      authors: "Saiprasad Ulhas Jamdar, Sourav Swami Mandal, E. Afreen Banu, Pinki Vishwakarma",
      link: "https://www.researchgate.net/publication/391969091_Potentially_Hazardous_Asteroid_Prediction_using_Adaboost_over_Linear_Regression"
    },
    
  ];

  const categories = ['All', 'Machine Learning'];

  const filteredPapers = selectedCategory === 'All' 
    ? researchPapers 
    : researchPapers.filter(paper => paper.category === selectedCategory);

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

  const handleViewPaper = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="research-section" ref={sectionRef}>
      <div className="research-container">
        <div className="research-header">
          <div className="section-badge">
            <span>🔬</span>
          </div>
          <h2 className="section-title">
            <span className="title-line">Research</span>
            <span className="title-highlight">Publications</span>
          </h2>
          <p className="section-subtitle">
            Exploring the frontiers of technology through rigorous research and innovation
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Research Papers Grid */}
        <div className={`research-grid ${isVisible ? 'animate-in' : ''}`}>
          {filteredPapers.map((paper, index) => (
            <div 
              key={paper.id} 
              className="research-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <div className="paper-meta">
                  <span className="paper-year">{paper.year}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="paper-category">{paper.category}</div>
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-journal">{paper.journal}</p>
                <p className="paper-authors">{paper.authors}</p>
              </div>

              <div className="card-footer">
                <button 
                  className="view-paper-btn"
                  onClick={() => handleViewPaper(paper.link)}
                  aria-label={`View ${paper.title}`}
                >
                  <span className="btn-text">View Paper</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </button>
              </div>

              <div className="card-glow"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Research;