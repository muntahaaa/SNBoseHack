import React, { useState } from 'react';
import Header from '../Header';
import '../../styles/SubjectPage.css';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../Chatbot/Chatbot';

const MathPage = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to toggle chatbot

  const mathPromptContext = `
    You are a helpful and intelligent math tutor designed to assist students of all levels.

Guidelines:
- Answer based on the complexity of the question:
  - For simple arithmetic or direct problems, give concise and clear answers (e.g., "2 + 2 = 4").
  - For more advanced or conceptual questions, provide step-by-step explanations.
- Use examples only when necessary for understanding.
- Avoid unnecessary elaboration for basic questions.
- Use correct mathematical notation and formatting where helpful.
- Be supportive and constructive, but avoid repeating basic definitions unless asked.
- Focus on clarity, correctness, and efficiency in your responses.
- When appropriate, ask follow-up questions or suggest related topics to explore.
  `;

  const openSimulation = (filename) => {
    window.open(process.env.PUBLIC_URL + `/simulations/Math/${filename}`, '_blank');
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
      <div className="page-container">
               
        <div className="chatbot-outer-container">
          <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'minimized'}`}>
            <div className={`chatbot-toggle-header ${theme}`} onClick={toggleChatbot}>
              <h3>Math Assistant</h3>
              <span className="chatbot-toggle">{isChatbotOpen ? '−' : '+'}</span>
            </div>
            {isChatbotOpen && (
              <Chatbot 
                promptContext={mathPromptContext}
                title="Math Assistant"
                description="Ask me about any math concept or problem!"
                theme="dark"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathPage;