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
        <h1>অঙ্ক শেখার মজার সিমুলেশন</h1>
        
        <div className="simulation-intro">
          <p>হাতে-কলমে শেখার জন্য গণিতের ইন্টারঅ্যাকটিভ সিমুলেশনগুলো অন্বেষণ করো। নিচের যেকোনো সিমুলেশনে ক্লিক করে শুরু করো।</p>
        </div>
        
        <div className="simulation-grid">
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/shape-quiz-thumbnail.png"} alt="Quadrilateral Explorer" />
            </div>
            <h3>চতুর্ভুজ সম্পর্কে জানো</h3>
            <p>বিভিন্ন আকৃতি অন্বেষণ করো ও তাদের বৈশিষ্ট্য সম্পর্কে জানো। ইন্টারঅ্যাকটিভ কুইজের মাধ্যমে তোমার জ্ঞান যাচাই করো।</p>
            <button className="simulation-btn" onClick={() => openSimulation('shapeQuiz.html')}>সিমুলেশন চালু করো</button>
          </div>
          
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/number-line-thumbnail.png"} alt="Number Line Simulation" />
            </div>
            <h3>সংখ্যা রেখা সম্পর্কে জানো</h3>
            <p>নাম্বার লাইনের ধারণাগুলো অনুশীলন করো এবং সংখ্যাগত সম্পর্ক সম্পর্কে তোমার বোঝাপড়া যাচাই করো।</p>
            <button className="simulation-btn" onClick={() => openSimulation('numberLineQuiz.html')}>সিমুলেশন চালু করো</button>
          </div>
        </div>
      </div>
      <div className="page-container">
                 <div className="chatbot-outer-container">
          <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'minimized'}`}>
            <div className={`chatbot-toggle-header ${theme}`} onClick={toggleChatbot}>
              <div className="chatbot-header-content">
                <img 
                  src={process.env.PUBLIC_URL + "/images/scientist.png"} 
                  alt="Scientist icon" 
                  className="chatbot-icon"
                />
                <h3>চলো ম্যাথ এক্সপার্ট এর সাথে কথা বলি</h3>
              </div>
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