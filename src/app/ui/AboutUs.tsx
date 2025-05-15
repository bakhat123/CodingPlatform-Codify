"use client"
import { useState, useEffect } from "react";
import './AboutUs.css';

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Timeline data
  const milestones = [
    {
      date: "January 2025",
      title: "GENESIS PROTOCOL INITIATED",
      description: "We began our journey with a mission to help coders unlock their potential by providing them with challenging opportunities.",
      icon: "🚀"
    },
    {
      date: "March 2025",
      title: "FIRST GLOBAL HACKATHON",
      description: "Our first coding competition was a huge success, bringing in participants from all over the world.",
      icon: "🌐"
    },
    {
      date: "June 2025",
      title: "100 USERS MILESTONE",
      description: "With the growth of our platform, we reached a significant milestone of 1000 active coders on our platform.",
      icon: "👾"
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    // Auto-rotate through sections
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % milestones.length);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [milestones.length]);

  return (
    <section className="cyber-about-us">
      {/* Animated background grid */}
      <div className="cyber-grid">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`grid-line-h-${i}`} className="grid-line horizontal"></div>
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`grid-line-v-${i}`} className="grid-line vertical"></div>
        ))}
      </div>
      
      {/* Loading overlay */}
      <div className={`loading-overlay ${loaded ? "fade-out" : ""}`}>
        <div className="terminal-text">
          <span>Initializing system</span>
          <span className="blink">_</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="cyber-container">
        <div className="cyber-header">
          <div className="glitch-container">
            <h1 className="glitch">ABOUT OUR MISSION</h1>
          </div>
          <div className="header-decoration">
            <div className="header-line"></div>
            <div className="header-dot"></div>
            <div className="header-line"></div>
          </div>
        </div>

        <div className="cyber-timeline-container">
          {/* Timeline navigation */}
          <div className="timeline-nav">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className={`nav-item ${activeSection === index ? "active" : ""}`}
                onClick={() => setActiveSection(index)}
              >
                <div className="nav-dot">
                  {activeSection === index && <div className="pulse-circle"></div>}
                </div>
                <span className="nav-date">{milestone.date}</span>
              </div>
            ))}
          </div>

          {/* Content display */}
          <div className="content-display">
            <div className="cyber-panel">
              <div className="panel-header">
                <div className="panel-icon">{milestones[activeSection].icon}</div>
                <div className="panel-alert">ENCRYPTED DATA DECODED</div>
              </div>
              
              <div className="panel-content">
                <div className="hologram">
                  <div className="hologram-rings">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                  </div>
                </div>
                
                <div className="panel-text">
                  <h2 className="section-title">{milestones[activeSection].title}</h2>
                  <div className="section-underline"></div>
                  <p className="section-description">{milestones[activeSection].description}</p>
                </div>
              </div>
              
              <div className="panel-decoration bottom">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-stats">
          <div className="stat-container">
            <div className="stat-value">10+</div>
            <div className="stat-label">ACTIVE USERS</div>
          </div>
          <div className="stat-container">
            <div className="stat-value">9.8k</div>
            <div className="stat-label">LINES OF CODE</div>
          </div>
          <div className="stat-container">
            <div className="stat-value">97%</div>
            <div className="stat-label">SUCCESS RATE</div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="cyber-decorations">
        <div className="circuit-line top-left"></div>
        <div className="circuit-line bottom-right"></div>
        <div className="glow-point point-1"></div>
        <div className="glow-point point-2"></div>
        <div className="glow-point point-3"></div>
      </div>
    </section>
  );
};

export default AboutUs;