import React from 'react';

const ChatMessage = ({ role, content, timestamp }) => {
  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get display role name
  const getDisplayRole = (role) => {
    switch(role.toLowerCase()) {
      case 'user':
        return 'You';
      case 'model':
      case 'assistant':
        return 'AI';
      default:
        return 'System';
    }
  };
  
  return (
    <div className={`message ${role === 'model' ? 'assistant' : role}`}>
      <div className="message-header">
        <span className="message-role">{getDisplayRole(role)}</span>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
      <div className="message-content">{content}</div>
    </div>
  );
};

export default ChatMessage;