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
        <h1>ফিজিক্স শেখার মজার সিমুলেশন</h1>
        
        <div className="simulation-intro">
          <p>হাতে-কলমে শেখার জন্য আমাদের ইন্টারঅ্যাকটিভ পদার্থবিজ্ঞান সিমুলেশনগুলো অন্বেষণ করো। ভার্চুয়াল এক্সপেরিমেন্টের মাধ্যমে বাস্তব জীবনের পদার্থবিজ্ঞানের ধারণাগুলো অনুভব করো।</p>
        </div>
        
        <div className="simulation-grid">
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src="/images/ohms-law-thumbnail.png" alt="Ohm's Law Simulation" />
            </div>
            <h3>ওহমের সূত্র ইন্টারঅ্যাকটিভ ল্যাব</h3>
            <p>বিদ্যুৎ প্রবাহ, ভোল্টেজ ও রোধের মধ্যে সম্পর্ক অন্বেষণ করো। ভার্চুয়াল পরীক্ষার মাধ্যমে ওহমের সূত্র সম্পর্কে বুঝে নাও।

</p>
            <button className="simulation-btn" onClick={() => openSimulation('ohms-law.html')}>সিমুলেশন চালু করো</button>
          </div>
          
          <div className="simulation-card">
            <div className="simulation-thumbnail">
              <img src="/images/weight-mass-thumbnail.png" alt="Weight and Mass Simulation" />
            </div>
            <h3>ভর ও ওজন সম্পর্কে জানো</h3>
            <p>ভর ও ওজনের পার্থক্য বোঝো এবং কিভাবে মহাকাশের বিভিন্ন স্থানে মাধ্যাকর্ষণ বস্তুর ওপর প্রভাব ফেলে তা শিখো।</p>
            <button className="simulation-btn" onClick={() => openSimulation('weight-mass.html')}>সিমুলেশন চালু করো</button>
          </div>
        </div>
      </div>      <div className="page-container">               
        <div className="chatbot-outer-container">
          <div className={`chatbot-wrapper ${isChatbotOpen ? 'open' : 'minimized'}`}>
            <div className={`chatbot-toggle-header ${theme}`} onClick={toggleChatbot}>
              <div className="chatbot-header-content">
                <img 
                  src={process.env.PUBLIC_URL + "/images/scientist.png"} 
                  alt="Scientist icon" 
                  className="chatbot-icon"
                />
                <h3>চলো ফিজিক্স টিউটর এর সাথে কথা বলি</h3>
              </div>
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