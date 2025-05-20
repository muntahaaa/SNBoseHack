import React from 'react';
import Header from './Header';
import '../styles/SubjectPage.css';

const ChemistryPage = () => {
  return (
    <div className="subject-page">
      <Header />
      <div className="subject-page-content">
        <h1>Chemistry</h1>
        
        <div className="subject-intro">
          <div className="subject-description">
            <p>Chemistry is the scientific study of the properties and behavior of matter. It focuses on elements, compounds, molecules, and how they interact with each other.</p>
            <p>Our chemistry section provides resources on organic chemistry, inorganic chemistry, biochemistry, and analytical chemistry.</p>
          </div>
          <div className="subject-image">
            <img src="/images/chemistry-illustration.jpg" alt="Chemistry illustration" />
          </div>
        </div>
        
        <div className="topic-grid">
          <div className="topic-card">
            <h3>Organic Chemistry</h3>
            <p>Study carbon compounds and their reactions</p>
            <button className="topic-btn">Explore</button>
          </div>
          
          <div className="topic-card">
            <h3>Inorganic Chemistry</h3>
            <p>Learn about non-carbon based compounds</p>
            <button className="topic-btn">Explore</button>
          </div>
          
          <div className="topic-card">
            <h3>Biochemistry</h3>
            <p>Explore the chemistry of living organisms</p>
            <button className="topic-btn">Explore</button>
          </div>
          
          <div className="topic-card">
            <h3>Analytical Chemistry</h3>
            <p>Learn methods for separation, identification, and analysis</p>
            <button className="topic-btn">Explore</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryPage;
