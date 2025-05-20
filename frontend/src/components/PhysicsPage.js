import React from 'react';
import Header from './Header';
import '../styles/SubjectPage.css';

const PhysicsPage = () => {
  return (
    <div className="subject-page">
      <Header />
      <div className="subject-page-content">
        <h1>Physics</h1>
        
        <div className="subject-intro">
          <div className="subject-description">
            <p>Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force.</p>
            <p>Our physics section offers resources covering classical mechanics, thermodynamics, electromagnetism, and modern physics.</p>
          </div>
          <div className="subject-image">
            <img src="/images/physics-illustration.jpg" alt="Physics illustration" />
          </div>
        </div>
        
        <div className="topic-grid">
          <div className="topic-card">
            <h3>Mechanics</h3>
            <p>Study motion, forces, energy, and momentum</p>
            <button className="topic-btn">Explore</button>
          </div>
          
          <div className="topic-card">
            <h3>Electromagnetism</h3>
            <p>Learn about electricity, magnetism, and electromagnetic waves</p>
            <button className="topic-btn">Explore</button>
          </div>
          
          <div className="topic-card">
            <h3>Thermodynamics</h3>
            <p>Explore heat, temperature, and energy transfer</p>
            <button className="topic-btn">Explore</button>
          </div>
          
          <div className="topic-card">
            <h3>Quantum Physics</h3>
            <p>Discover the world of subatomic particles</p>
            <button className="topic-btn">Explore</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsPage;
