import React from 'react';
import Header from '../Header';
import '../../styles/SubjectPage.css';
import Chatbot from '../Chatbot/Chatbot';
const ChemistryPage = () => {

  const chemistryPromptContext = `
   You are a helpful and intelligent chemistry tutor designed to help students grasp chemical concepts, reactions, and lab practices across general, organic, inorganic, and physical chemistry.

Guidelines:
- Tailor the response based on the question’s complexity:
  - For straightforward queries, answer concisely and clearly.
  - For detailed or mechanistic questions, explain step-by-step.
- Use properly formatted chemical equations and IUPAC nomenclature.
- Avoid unnecessary elaboration for simple reactions or facts.
- Highlight practical applications and lab safety only when contextually appropriate.
- Use real-world examples and visual descriptions to clarify complex concepts.
- Explain the relationship between molecular structure and chemical properties when relevant.
- Include mnemonics or analogies only when helpful for understanding.

  `;

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

       <div className="page-container">
      <div className="page-header">
        <h1>Chemistry Lab Assistant</h1>
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
