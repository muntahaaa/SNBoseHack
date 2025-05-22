import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import AuthContext from '../../context/AuthContext';

const CreateThought = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ['']
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.post('/api/research/thoughts', {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim())
      });
      navigate('/research/thoughts');
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Error creating thought'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'researcher') {
    return <div className="error-message">Only researchers can create thoughts</div>;
  }

  return (
    <div className="create-thought">
      <div className="form-header">
        <h1>Share Research Thought</h1>
        <p className="subtitle">Share your research ideas and insights with the community</p>
      </div>

      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="thought-form">
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter your thought title"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content*</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={errors.content ? 'error' : ''}
            placeholder="Share your research thoughts..."
            rows="8"
          />
          {errors.content && <span className="error-text">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label>Tags</label>
          {formData.tags.map((tag, index) => (
            <div key={index} className="tag-input-group">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder="Add a tag"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="add-btn"
          >
            Add Tag
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Thought'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateThought;