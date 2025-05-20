import React from 'react';
import Header from './Header';
import '../styles/SubjectPage.css';

const MathPage = () => {
  const openSimulation = (filename) => {
    window.open(process.env.PUBLIC_URL + `/simulations/Math/${filename}`, '_blank');
  };

  return (
    <div className="subject-page">
      <Header />
      <div className="subject-page-content">
        <h1>Interactive Mathematics Simulations</h1>
        
        <div className="simulation-intro">
          <p>Explore our interactive mathematical simulations for hands-on learning. Click on any simulation below to begin.</p>
        </div>
        
        <div className="simulation-grid">
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/shape-quiz-thumbnail.png"} alt="Quadrilateral Explorer" />
            </div>
            <h3>Interactive Quadrilateral Explorer</h3>
            <p>Explore different shapes and learn about their properties. Test your knowledge with interactive quizzes.</p>
            <button className="simulation-btn" onClick={() => openSimulation('shapeQuiz.html')}>Launch Simulation</button>
          </div>
          
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/number-line-thumbnail.png"} alt="Number Line Simulation" />
            </div>
            <h3>Number Line Simulation</h3>
            <p>Practice number line concepts and test your understanding of numerical relationships.</p>
            <button className="simulation-btn" onClick={() => openSimulation('numberLineQuiz.html')}>Launch Simulation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathPage;
