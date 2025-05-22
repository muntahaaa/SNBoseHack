import React, { useState } from 'react';
import Header from '../Header';
import '../../styles/SubjectPage.css';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../Chatbot/Chatbot';

const PhysicsPage = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to toggle chatbot

  const physicsPromptContext = `
    You are a helpful and intelligent physics tutor designed to assist students in understanding both fundamental and advanced concepts in physics.

Guidelines:
- Adjust the depth of explanation based on question complexity:
  - For basic questions, give clear and concise answers.
  - For more complex problems, explain step-by-step with appropriate detail.
- Use real-world examples or visual descriptions only when needed for clarity.
- Format equations and units correctly.
- Avoid over-explaining simple concepts.
- Relate principles to everyday experiences when it adds value to understanding.
- Include distinctions between classical and modern (e.g., quantum, relativity) physics when relevant.
- Introduce historical or experimental context only if it helps comprehension.
- Encourage curiosity and critical thinking, but keep answers efficient and targeted.
  `;
  
  const openSimulation = (filename) => {
    window.open(`/simulations/Physics/${filename}`, '_blank');
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const theme = "dark"; // Define theme to match Chatbot prop

  return (
    <div className="subject-page">
      <button className="page-back-button" onClick={() => navigate('/')}>
        <span className="back-arrow">←</span>
        Back to Home
      </button>
      <Header />
      <div className="subject-page-content">
        <h1>Interactive Physics Simulations</h1>
        
        <div className="simulation-intro">
          <p>Explore our interactive physics simulations for hands-on learning. Experience real-world physics concepts through virtual experiments.</p>
        </div>
        
        <div className="simulation-grid">
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src="/images/ohms-law-thumbnail.png" alt="Ohm's Law Simulation" />
            </div>
            <h3>Ohm's Law Interactive Lab</h3>
            <p>Explore the relationship between voltage, current, and resistance in electrical circuits. Conduct virtual experiments to understand Ohm's Law.</p>
            <button className="simulation-btn" onClick={() => openSimulation('ohms-law.html')}>Launch Simulation</button>
          </div>
          
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src="/images/weight-mass-thumbnail.png" alt="Weight and Mass Simulation" />
            </div>
            <h3>Weight and Mass Explorer</h3>
            <p>Understand the difference between weight and mass, and how gravity affects objects differently across the universe.</p>
            <button className="simulation-btn" onClick={() => openSimulation('weight-mass.html')}>Launch Simulation</button>
          </div>
        </div>
      </div>
      <div className="page-container">               
        <div className="chatbot-outer-container">
          <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'minimized'}`}>
            <div className={`chatbot-toggle-header ${theme}`} onClick={toggleChatbot}>
              <h3>Physics Tutor</h3>
              <span className="chatbot-toggle">{isChatbotOpen ? '−' : '+'}</span>
            </div>
            {isChatbotOpen && (
              <Chatbot 
                promptContext={physicsPromptContext}
                title="Physics Tutor"
                description="I can help explain physics concepts and solve problems!"
                theme="dark"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsPage;