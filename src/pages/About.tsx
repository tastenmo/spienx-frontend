import React from 'react'
import './About.css'

function About() {
  return (
    <div className="page about-page">
      <h1>About Spienx</h1>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Spienx is dedicated to building modern, efficient, and scalable web applications.
            This multi-page React application showcases best practices in frontend development.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h3>React</h3>
              <p>A JavaScript library for building user interfaces</p>
            </div>
            <div className="tech-item">
              <h3>React Router</h3>
              <p>Declarative routing for React applications</p>
            </div>
            <div className="tech-item">
              <h3>Vite</h3>
              <p>Next generation frontend tooling</p>
            </div>
            <div className="tech-item">
              <h3>Modern CSS</h3>
              <p>Clean and responsive styling</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Fast and responsive user interface</li>
            <li>Modern development practices</li>
            <li>Clean and maintainable code</li>
            <li>Excellent developer experience</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default About
