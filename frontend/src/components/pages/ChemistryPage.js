import React, { useState } from 'react';
import Header from '../Header';
import '../../styles/SubjectPage.css';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../Chatbot/Chatbot';

const ChemistryPage = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to toggle chatbot

  const chemistryPromptContext = `
    You are a helpful and intelligent chemistry tutor designed to help students grasp chemical concepts, reactions, and lab practices across general, organic, inorganic, and physical chemistry.

    Guidelines:
    - Tailor the response based on the question's complexity:
      - For straightforward queries, answer concisely and clearly.
      - For detailed or mechanistic questions, explain step-by-step.
    - Use properly formatted chemical equations and IUPAC nomenclature.
    - Avoid unnecessary elaboration for simple reactions or facts.
    - Highdark practical applications and lab safety only when contextually appropriate.
    - Use real-world examples and visual descriptions to clarify complex concepts.
    - Explain the relationship between molecular structure and chemical properties when relevant.
    - Include mnemonics or analogies only when helpful for understanding.
  `;

  const openSimulation = (filename) => {
    window.open(process.env.PUBLIC_URL + `/simulations/Chemistry/${filename}`, '_blank');
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
        <h1>রসায়ন শেখার মজার সিমুলেশন</h1>
        
        <div className="simulation-intro">
          <p>মজার ইন্টারঅ্যাকটিভ রসায়ন সিমুলেশনের মাধ্যমে শেখো হাতে-কলমে। ভার্চুয়াল ল্যাবে নানা রাসায়নিক বিক্রিয়া ও পরীক্ষা নিজের মতো করে করো!</p>
        </div>
        
        <div className="simulation-grid">
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/litmus-test-thumbnail.png"} alt="Litmus Test Simulation" />
            </div>
            <h3>লিটমাস পরীক্ষা করি</h3>
            <p>ভার্চুয়াল লিটমাস পরীক্ষা করে চিনে নাও অ্যাসিড ও ক্ষার। ইন্টারঅ্যাকটিভ এক্সপেরিমেন্টের মাধ্যমে pH সূচকের ব্যবহার শিখো।</p>
            <button className="simulation-btn" onClick={() => openSimulation('litmus.html')}>সিমুলেশন চালু করো</button>
          </div>
          
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src={process.env.PUBLIC_URL + "/images/molarity-calc-thumbnail.png"} alt="Molarity Calculator" />
            </div>
            <h3>মোলারিটি নির্ণয় করি</h3>
            <p>দ্রবণের ঘনত্ব হিসাব করো ও চিত্রের মাধ্যমে বোঝো। ইন্টারঅ্যাকটিভভাবে দ্রবণ তৈরি করে মোলারিটি সম্পর্কে শিখো।</p>
            <button className="simulation-btn" onClick={() => openSimulation('molarity.html')}>সিমুলেশন চালু করো</button>
          </div>
        </div>
      </div>
      <div className="page-container">
        <div className="chatbot-outer-container">          <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'minimized'}`}>
            <div className={`chatbot-toggle-header ${theme}`} onClick={toggleChatbot}>
              <div className="chatbot-header-content">
                <img 
                  src={process.env.PUBLIC_URL + "/images/scientist.png"} 
                  alt="Scientist icon" 
                  className="chatbot-icon"
                />
                <h3>চলো কেমিস্ট্রি এক্সপার্ট এর সাথে কথা বলি</h3>
              </div>
              <span className="chatbot-toggle">{isChatbotOpen ? '−' : '+'}</span>
            </div>
            {isChatbotOpen && (
              <Chatbot 
                promptContext={chemistryPromptContext}
                title="Chemistry Expert"
                description="Ask me about chemical reactions, structures, or lab procedures!"
                theme="dark"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryPage;