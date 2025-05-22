import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import AuthContext from '../../context/AuthContext';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    deadline: '',
    requirements: [''],
    resources: [{ title: '', url: '' }],
    maxParticipants: '',
    skillsRequired: [''],
    status: 'published' // Changed default status to published
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Other'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'resources' ? { title: '', url: '' } : '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.requirements[0]) newErrors.requirements = 'At least one requirement is needed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data } = await axios.post('/api/research/challenges', formData);
      navigate(`/research/challenges/${data.challenge._id}`);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Error creating challenge'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-challenge">
      <div className="form-header">
        <h1>Create Research Challenge</h1>
        <p className="subtitle">Design a challenge to engage students in your research</p>
      </div>

      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="challenge-form">
        <div className="form-group">
          <label htmlFor="title">Challenge Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter a clear, specific title"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Describe the challenge, its goals, and expected outcomes"
            rows="6"
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty Level*</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Submission Deadline*</label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={errors.deadline ? 'error' : ''}
            min={new Date().toISOString().slice(0, 16)}
          />
          {errors.deadline && <span className="error-text">{errors.deadline}</span>}
        </div>

        <div className="form-group">
          <label>Requirements*</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange(index, 'requirements', e.target.value)}
                placeholder="Add a requirement"
                className={errors.requirements ? 'error' : ''}
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'requirements')}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('requirements')}
            className="add-btn"
          >
            Add Requirement
          </button>
          {errors.requirements && <span className="error-text">{errors.requirements}</span>}
        </div>

        <div className="form-group">
          <label>Helpful Resources</label>
          {formData.resources.map((resource, index) => (
            <div key={index} className="resource-item">
              <input
                type="text"
                value={resource.title}
                onChange={(e) => handleArrayChange(index, 'resources', { ...resource, title: e.target.value })}
                placeholder="Resource title"
              />
              <input
                type="url"
                value={resource.url}
                onChange={(e) => handleArrayChange(index, 'resources', { ...resource, url: e.target.value })}
                placeholder="Resource URL"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'resources')}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('resources')}
            className="add-btn"
          >
            Add Resource
          </button>
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          {formData.skillsRequired.map((skill, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange(index, 'skillsRequired', e.target.value)}
                placeholder="Add a required skill"
              />
              {formData.skillsRequired.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'skillsRequired')}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('skillsRequired')}
            className="add-btn"
          >
            Add Skill
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="maxParticipants">Maximum Participants</label>
          <input
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            placeholder="Leave empty for unlimited"
            min="1"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Challenge'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallenge;