import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './Chatbot.css';

const Chatbot = ({
  promptContext = "You are a helpful AI assistant.",
  title = "AI Assistant",
  description = "Ask me anything!",
  apiUrl = "http://localhost:5000/api/chat",
  theme = "light"
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBengaliTooltip, setShowBengaliTooltip] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat when new messages come in
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async (messageText, inBengali = false) => {
    if (!messageText.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // If Bengali is requested, modify the message
      const effectiveMessage = inBengali 
        ? `Provide the answer in Bengali (Bangla) and avoid using English.\n\n${messageText}`
        : messageText;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: effectiveMessage,
          promptContext,
          chatHistory: messages.map(msg => ({
            ...msg,
            role: msg.role === 'assistant' ? 'model' : msg.role
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      const botMessage = {
        role: 'model',
        content: data.response,
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = {
        role: 'system',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(inputValue);
  };

  const handleBengaliClick = async (e) => {
    e.preventDefault();
    setShowBengaliTooltip(false);
    await sendMessage(inputValue, true);
  };

  return (
    <div className={`chatbot-container ${theme}`}>
      <div className="chatbot-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Send a message to start chatting!</p>
            {showBengaliTooltip && (
              <div className="bengali-tooltip">
                💬 Want the answer in Bengali? Click "বাংলা"
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                role={message.role} 
                content={message.content} 
                timestamp={message.timestamp}
              />
            ))}
          </>
        )}
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <div className="button-group">
          <button type="submit" className="send-btn" disabled={isLoading || !inputValue.trim()}>
            Send
          </button>
          <button 
            type="button" 
            className="bengali-btn" 
            onClick={handleBengaliClick}
            disabled={isLoading || !inputValue.trim()}
            title="Get answer in Bengali"
          >
            বাংলা
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;