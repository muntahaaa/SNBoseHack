import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './VolunteerBoard.css';




const VolunteerBoard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all'
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data } = await axios.get('/api/volunteer');
      if (data.success) {
        setOpportunities(data.opportunities);
        setError(null);
      } else {
        setError('Failed to fetch opportunities');
        setOpportunities([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch volunteer opportunities');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = (opportunity) => {
    if (filters.status !== 'all' && opportunity.status !== filters.status) return false;
    if (filters.category !== 'all' && opportunity.category !== filters.category) return false;
    return true;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) return <div className="loading">Loading opportunities...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="volunteer-board">
      <div className="board-header">
        <h1>Volunteer Opportunities</h1>
        {user?.role === 'researcher' && (
          <Link to="/research/volunteer/new" className="create-btn">
            Create Opportunity
          </Link>
        )}
      </div>

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="mathematics">Mathematics</option>
        </select>
      </div>

      <div className="opportunities-grid">
        {opportunities.filter(filterOpportunities).map(opportunity => (
          <Link
            to={`/research/volunteer/${opportunity._id}`}
            key={opportunity._id}
            className="opportunity-card"
          >
            <div className={`status ${opportunity.status}`}>
              {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
            </div>
            <h2>{opportunity.title}</h2>
            <div className="meta-info">
              <span className="category">{opportunity.department}</span>
              <span className="duration">{opportunity.duration}</span>
            </div>
            <p className="description">{opportunity.description}</p>
            <div className="skills">
              {opportunity.requirements?.map((req, index) => (
                <span key={index} className="skill-tag">
                  {req}
                </span>
              ))}
            </div>
            <div className="card-footer">
              <span className="applications">
                {opportunity.applications?.length || 0} applications
              </span>
              <span className="deadline">
                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {opportunities.filter(filterOpportunities).length === 0 && (
        <div className="no-results">
          No opportunities found matching your filters
        </div>
      )}
    </div>
  );
};

export default VolunteerBoard;