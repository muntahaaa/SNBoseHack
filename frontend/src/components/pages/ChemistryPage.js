import React from 'react';
import Header from '../Header';
import '../../styles/SubjectPage.css';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../Chatbot/Chatbot';

const ChemistryPage = () => {
  const navigate = useNavigate();
  

  const chemistryPromptContext = `
    You are a helpful and intelligent chemistry tutor designed to help students grasp chemical concepts, reactions, and lab practices across general, organic, inorganic, and physical chemistry.

    Guidelines:
    - Tailor the response based on the question's complexity:
      - For straightforward queries, answer concisely and clearly.
      - For detailed or mechanistic questions, explain step-by-step.
    - Use properly formatted chemical equations and IUPAC nomenclature.
    - Avoid unnecessary elaboration for simple reactions or facts.
    - Highlight practical applications and lab safety only when contextually appropriate.
    - Use real-world examples and visual descriptions to clarify complex concepts.
    - Explain the relationship between molecular structure and chemical properties when relevant.
    - Include mnemonics or analogies only when helpful for understanding.
  `;

  const openSimulation = (filename) => {
   //window.open(process.env.PUBLIC_URL + `/simulations/Math/${filename}`, '_blank');
    window.open(process.env.PUBLIC_URL + `/simulations/Chemistry/${filename}`, '_blank');
  };

  return (
    <div className="subject-page">
        <button className="page-back-button" onClick={() => navigate('/')}>
        <span className="back-arrow">←</span>
        Back to Home
      </button>
      <Header />
      <div className="subject-page-content">
        <h1>Interactive Chemistry Simulations</h1>
        
        <div className="simulation-intro">
          <p>Explore our interactive chemistry simulations for hands-on learning. Experience real chemical reactions and lab procedures through virtual experiments.</p>
        </div>
        
        <div className="simulation-grid">
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/litmus-test-thumbnail.png"} alt="Litmus Test Simulation" />
            </div>
            <h3>AR Litmus Test Lab</h3>
            <p>Conduct virtual litmus tests to identify acids and bases. Learn about pH indicators through interactive experiments.</p>
            <button className="simulation-btn" onClick={() => openSimulation('litmus.html')}>Launch Simulation</button>
          </div>
          
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/molarity-calc-thumbnail.png"} alt="Molarity Calculator" />
            </div>
            <h3>AR Molarity Calculator</h3>
            <p>Calculate and visualize solution concentrations. Learn about molarity through interactive solution preparation.</p>
            <button className="simulation-btn" onClick={() => openSimulation('molarity.html')}>Launch Simulation</button>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="page-header">
          <h2>Chemistry Lab Assistant</h2>
          <p>Explore elements, compounds, reactions, and chemical principles</p>
        </div>
        
        <Chatbot 
          promptContext={chemistryPromptContext}
          title="Chemistry Expert"
          description="Ask me about chemical reactions, structures, or lab procedures!"
          theme="light"
        />
        
        <div className="page-footer">
          <p>Tip: Try asking about periodic trends, reaction types, or molecular structures!</p>
        </div>
      </div>
    </div>
  );
};

export default ChemistryPage;
