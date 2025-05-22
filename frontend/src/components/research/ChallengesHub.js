import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ChallengesHub = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isResearcher = user?.role === 'researcher';

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  
  const categories = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Other'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const params = new URLSearchParams({
          filter,
          ...(category && { category }),
          ...(difficulty && { difficulty })
        });

        const { data } = await axios.get('/api/research/challenges?' + params.toString());
        setChallenges(data.challenges);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [filter, category, difficulty]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#2ecc71';
      case 'intermediate':
        return '#f39c12';
      case 'advanced':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getDeadlineStatus = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'Closed';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return '1 day left';
    return daysLeft + ' days left';
  };

  if (loading) {
    return <div className="loading">Loading challenges...</div>;
  }

  return (
    <div className="challenges-hub">
      <div className="hub-header">
        <div>
          <h1>Research Challenges</h1>
          <p className="subtitle">
            {isResearcher 
              ? "Create and manage research challenges for students"
              : "Take on research challenges to showcase your skills"
            }
          </p>
        </div>
        {isResearcher && (
          <Link to="/research/challenges/new" className="create-challenge-btn">
            Create Challenge
          </Link>
        )}
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="latest">Latest</option>
            <option value="active">Active</option>
            <option value="popular">Popular</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search challenges..."
            className="search-input"
          />
        </div>
      </div>

      <div className="challenges-grid">
        {challenges.length > 0 ? (
          challenges.map(challenge => (
            <article 
              key={challenge._id} 
              className="challenge-card"
              style={{
                borderColor: getDifficultyColor(challenge.difficulty)
              }}
            >
              <div className="challenge-header">
                <span className="category-tag">{challenge.category}</span>
                <div className="badges">
                  <span 
                    className="difficulty-badge"
                    style={{ 
                      backgroundColor: getDifficultyColor(challenge.difficulty),
                      color: 'white'
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                  {isResearcher && (
                    <span className={`status-badge ${challenge.status}`}>
                      {challenge.status}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="challenge-title">{challenge.title}</h2>
              <p className="challenge-description">
                {challenge.description.substring(0, 150)}...
              </p>

              <div className="challenge-meta">
                <div className="meta-item">
                  <span className="meta-icon">👥</span>
                  <span>{challenge.submissions?.length || 0} submissions</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏰</span>
                  <span>{getDeadlineStatus(challenge.deadline)}</span>
                </div>
              </div>

              {challenge.skillsRequired?.length > 0 && (
                <div className="skills-required">
                  {challenge.skillsRequired.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              <div className="challenge-footer">
                <div className="author-info">
                  <span className="author-name">By {challenge.author.name}</span>
                </div>
                <Link 
                  to={'/research/challenges/' + challenge._id}
                  className="view-challenge-btn"
                >
                  {isResearcher ? 'Manage Challenge' : 'View Challenge'}
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>No challenges found</h3>
            <p>
              {isResearcher 
                ? "Create your first research challenge to engage with students!"
                : "Check back soon for new research challenges."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesHub;