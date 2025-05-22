import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    requirements: [''],
    positions: 1,
    deadline: '',
    type: 'part-time',
    duration: '',
    status: 'open'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/volunteer', formData);
      if (data.success) {
        navigate('/research/volunteer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Other'];

  return (
    <div className="create-opportunity">
      <h1>Create Volunteer Opportunity</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="200"
            placeholder="Enter opportunity title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Describe the opportunity and responsibilities"
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department*</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Requirements*</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="requirement-input">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder="Enter requirement"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="add-btn"
          >
            Add Requirement
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="positions">Number of Positions*</label>
            <input
              type="number"
              id="positions"
              name="positions"
              value={formData.positions}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type*</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration*</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g., 3 months"
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Application Deadline*</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity;