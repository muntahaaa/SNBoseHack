import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isResearcher = user?.role === 'researcher';

  const [challenge, setChallenge] = useState(null);
  const [submission, setSubmission] = useState({ content: '', attachments: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const fileInputRef = useRef();
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [filePreview, setFilePreview] = useState([]);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data } = await axios.get(`/api/research/challenges/${id}`);
        setChallenge(data.challenge);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching challenge');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFilePreview(files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    })));
  };

  const handleRemoveFile = (index) => {
    setFilePreview(prev => prev.filter((_, i) => i !== index));
    // Reset file input if all files are removed
    if (filePreview.length === 1) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const { data } = await axios.post('/api/research/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.files;
    } catch (error) {
      throw new Error('Error uploading files');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadingFiles(true);

    try {
      let attachments = [];
      if (filePreview.length > 0) {
        const files = Array.from(fileInputRef.current.files);
        attachments = await uploadFiles(files);
      }

      const { data } = await axios.post(`/api/research/challenges/${id}/submit`, {
        ...submission,
        attachments
      });

      setChallenge(prev => ({
        ...prev,
        submissions: [...prev.submissions, data.submission]
      }));
      
      // Reset form
      setSubmission({ content: '', attachments: [] });
      setFilePreview([]);
      fileInputRef.current.value = '';
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting solution');
    } finally {
      setSubmitting(false);
      setUploadingFiles(false);
    }
  };

  const handleReview = async (submissionId, feedback, grade, status) => {
    try {
      const { data } = await axios.post(
        `/api/research/challenges/${id}/submissions/${submissionId}/review`,
        { feedback, grade, status }
      );
      setChallenge(prev => ({
        ...prev,
        submissions: prev.submissions.map(sub => 
          sub._id === submissionId ? { ...sub, ...data.submission } : sub
        )
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error reviewing submission');
    }
  };

  if (loading) {
    return <div className="loading">Loading challenge...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!challenge) {
    return <div className="error-message">Challenge not found</div>;
  }

  const isAuthor = challenge.author._id === user._id;
  const hasSubmitted = challenge.submissions?.some(sub => sub.student._id === user._id);
  const userSubmission = challenge.submissions?.find(sub => sub.student._id === user._id);
  const isOpen = challenge.status === 'published' && new Date(challenge.deadline) > new Date();

  return (
    <div className="challenge-detail">
      <div className="detail-header">
        <div className="header-content">
          <div className="meta-tags">
            <span className="category-tag">{challenge.category}</span>
            <span 
              className="difficulty-badge"
              style={{ 
                backgroundColor: 
                  challenge.difficulty === 'beginner' ? '#2ecc71' :
                  challenge.difficulty === 'intermediate' ? '#f39c12' : '#e74c3c'
              }}
            >
              {challenge.difficulty}
            </span>
            <span className={`status-badge ${challenge.status}`}>
              {challenge.status}
            </span>
          </div>
          <h1>{challenge.title}</h1>
          <div className="challenge-meta">
            <span>By {challenge.author.name}</span>
            <span>•</span>
            <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{challenge.submissions?.length || 0} submissions</span>
          </div>
        </div>
        {isResearcher && isAuthor && (
          <div className="header-actions">
            <button onClick={() => navigate(`/research/challenges/${id}/edit`)} className="edit-btn">
              Edit Challenge
            </button>
          </div>
        )}
      </div>

      <div className="detail-tabs">
        <button
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Challenge Details
        </button>
        {(isResearcher || hasSubmitted) && (
          <button
            className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
          </button>
        )}
      </div>

      <div className="detail-content">
        {activeTab === 'details' ? (
          <>
            <section className="challenge-description">
              <h2>Description</h2>
              <p>{challenge.description}</p>
            </section>

            <section className="challenge-requirements">
              <h2>Requirements</h2>
              <ul>
                {challenge.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>

            {challenge.resources?.length > 0 && (
              <section className="challenge-resources">
                <h2>Helpful Resources</h2>
                <ul>
                  {challenge.resources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {challenge.skillsRequired?.length > 0 && (
              <section className="required-skills">
                <h2>Required Skills</h2>
                <div className="skills-list">
                  {challenge.skillsRequired.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {!isResearcher && isOpen && !hasSubmitted && (
              <section className="submission-form">
                <h2>Submit Your Solution</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="content">Your Solution*</label>
                    <textarea
                      id="content"
                      value={submission.content}
                      onChange={(e) => setSubmission(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Describe your solution approach and findings..."
                      rows="6"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Attachments
                      <span className="file-help">(Upload any relevant files, diagrams, or code)</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="file-input"
                      accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
                    />
                    {filePreview.length > 0 && (
                      <div className="file-preview-list">
                        {filePreview.map((file, index) => (
                          <div key={index} className="file-preview-item">
                            <div className="file-info">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            {file.preview && (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="file-thumbnail"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="remove-file-btn"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting || uploadingFiles}
                  >
                    {submitting ? 'Submitting...' :
                     uploadingFiles ? 'Uploading files...' : 'Submit Solution'}
                  </button>
                </form>
              </section>
            )}

            {!isResearcher && hasSubmitted && (
              <section className="your-submission">
                <h2>Your Submission</h2>
                <div className="submission-status">
                  Status: <span className={`status ${userSubmission.status}`}>
                    {userSubmission.status}
                  </span>
                </div>

                <div className="submission-content">
                  <h3>Your Response</h3>
                  <p>{userSubmission.content}</p>

                  {userSubmission.attachments?.length > 0 && (
                    <div className="submission-attachments">
                      <h3>Attachments</h3>
                      <div className="attachment-list">
                        {userSubmission.attachments.map((file, index) => (
                          <a
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-item"
                          >
                            <span className="attachment-name">{file.name}</span>
                            <span className="attachment-size">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {userSubmission.feedback && (
                    <div className="submission-feedback">
                      <h3>Feedback</h3>
                      <p>{userSubmission.feedback.content}</p>
                      {userSubmission.feedback.grade && (
                        <div className="grade">
                          Grade: {userSubmission.feedback.grade}/100
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="submissions-list">
            <h2>Challenge Submissions</h2>
            {challenge.submissions?.length > 0 ? (
              challenge.submissions.map(sub => (
                <div key={sub._id} className="submission-card">
                  <div className="submission-header">
                    <div className="student-info">
                      <span className="student-name">{sub.student.name}</span>
                      <span className="submission-date">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`status ${sub.status}`}>
                      {sub.status}
                    </span>
                  </div>
                  
                  <div className="submission-content">
                    <p>{sub.content}</p>

                    {sub.attachments?.length > 0 && (
                      <div className="submission-attachments">
                        <h4>Attachments</h4>
                        <div className="attachment-list">
                          {sub.attachments.map((file, index) => (
                            <a
                              key={index}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="attachment-item"
                            >
                              <span className="attachment-name">{file.name}</span>
                              <span className="attachment-size">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isResearcher && isAuthor && sub.status === 'pending' && (
                    <div className="review-form">
                      <h3>Review Submission</h3>
                      <textarea
                        placeholder="Provide detailed feedback..."
                        value={sub.tempFeedback || ''}
                        onChange={(e) => {
                          setChallenge(prev => ({
                            ...prev,
                            submissions: prev.submissions.map(s => 
                              s._id === sub._id ? { ...s, tempFeedback: e.target.value } : s
                            )
                          }));
                        }}
                        rows="4"
                      />
                      <div className="grade-input">
                        <label>Grade:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={sub.tempGrade || ''}
                          onChange={(e) => {
                            setChallenge(prev => ({
                              ...prev,
                              submissions: prev.submissions.map(s => 
                                s._id === sub._id ? { ...s, tempGrade: e.target.value } : s
                              )
                            }));
                          }}
                        />
                        <span>/100</span>
                      </div>
                      <div className="review-actions">
                        <button
                          onClick={() => handleReview(sub._id, sub.tempFeedback, sub.tempGrade)}
                          className="review-btn"
                        >
                          Submit Review
                        </button>
                        <button
                          onClick={() => handleReview(sub._id, sub.tempFeedback, null, 'revision-requested')}
                          className="revision-btn"
                        >
                          Request Revision
                        </button>
                      </div>
                    </div>
                  )}

                  {sub.feedback && (
                    <div className="feedback-section">
                      <h3>Feedback</h3>
                      <p>{sub.feedback.content}</p>
                      {sub.feedback.grade && (
                        <div className="grade">
                          Grade: {sub.feedback.grade}/100
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No submissions yet</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;