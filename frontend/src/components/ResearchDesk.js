import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import AuthContext from '../context/AuthContext';
import '../styles/ResearchDesk.css';

const ResearchDesk = () => {
  const [loading, setLoading] = useState(true);
  const [researchData, setResearchData] = useState(null);
  const [error, setError] = useState('');
  const { isAuthenticated, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const { data } = await axios.get('/api/research-desk', config);
        setResearchData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load research data. Please try again later.');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResearchData();
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="research-desk-container">
      <Header />
      <div className="research-content">
        <h1>Research Desk</h1>
        
        {loading ? (
          <div className="loading">Loading research data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="research-dashboard">
            <div className="welcome-message">
              <h2>Welcome to your Research Desk</h2>
              <p>This is a protected area for users to access research materials.</p>
            </div>
            
            <div className="research-categories">
              <div className="research-card">
                <h3>Mathematics Research</h3>
                <p>Access the latest research papers in mathematics</p>
                <button className="research-btn">View Resources</button>
              </div>
              
              <div className="research-card">
                <h3>Physics Research</h3>
                <p>Explore cutting-edge physics research materials</p>
                <button className="research-btn">View Resources</button>
              </div>
              
              <div className="research-card">
                <h3>Chemistry Research</h3>
                <p>Discover breakthrough chemistry research studies</p>
                <button className="research-btn">View Resources</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDesk;
