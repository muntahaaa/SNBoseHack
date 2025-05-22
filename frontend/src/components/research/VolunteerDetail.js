import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './VolunteerDetail.css';

const VolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [statement, setStatement] = useState('');
  const [cv, setCV] = useState(null);
  const [userApplication, setUserApplication] = useState(null);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const { data } = await axios.get(`/api/volunteer/${id}`);
      setOpportunity(data.opportunity);
      
      // Check if user has already applied
      if (user && data.opportunity.applications) {
        const existing = data.opportunity.applications.find(
          app => app.student._id.toString() === user._id.toString()
        );
        if (existing) setUserApplication(existing);
      }
      
      console.log('Debug Info:', {
        user,
        opportunityStatus: data.opportunity.status,
        deadline: data.opportunity.deadline,
        isOwner: user?._id.toString() === data.opportunity.researcher._id.toString(),
        hasApplied: data.opportunity.applications?.some(
          app => app.student._id.toString() === user?._id.toString()
        )
      });
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('statement', statement);
      if (cv) {
        formData.append('cv', cv);
      }

      const { data } = await axios.post(`/api/volunteer/${id}/apply`, {
        statement,
        cv: cv ? {
          name: cv.name,
          type: cv.type,
          size: cv.size
        } : null
      });

      if (data.success) {
        setApplying(false);
        setUserApplication(data.application);
        fetchOpportunity();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting application');
    }
  };

  const handleReview = async (applicationId, status, feedback) => {
    try {
      await axios.post(`/api/volunteer/${id}/applications/${applicationId}/review`, {
        status,
        feedback
      });

      fetchOpportunity();
    } catch (err) {
      setError(err.response?.data?.message || 'Error reviewing application');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!opportunity) return <div className="error">Opportunity not found</div>;

  const hasApplied = opportunity.applications?.some(
    app => app.student._id.toString() === user?._id.toString()
  );

  const isOwner = user?._id.toString() === opportunity.researcher._id.toString();
  const isPastDeadline = new Date(opportunity.deadline) < new Date();
  const isClosed = opportunity.status === 'closed';

  return (
    <div className="volunteer-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="opportunity-header">
        <h1>{opportunity.title}</h1>
        <div className="meta-info">
          <span>Department: {opportunity.department}</span>
          <span>Type: {opportunity.type}</span>
          <span>Duration: {opportunity.duration}</span>
        </div>
      </div>

      <div className="opportunity-content">
        <div className="main-content">
          <section>
            <h2>Description</h2>
            <p>{opportunity.description}</p>
          </section>

          <section>
            <h2>Requirements</h2>
            <ul>
              {opportunity.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Details</h2>
            <div className="detail-grid">
              <div>
                <strong>Positions:</strong> {opportunity.positions}
              </div>
              <div>
                <strong>Applications:</strong> {opportunity.applications?.length || 0}
              </div>
              <div>
                <strong>Deadline:</strong>{' '}
                {new Date(opportunity.deadline).toLocaleDateString()}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <span className={`status ${opportunity.status}`}>
                  {opportunity.status}
                </span>
              </div>
            </div>
          </section>

          {user && !isOwner && opportunity.status === 'open' && !isPastDeadline && !hasApplied && (
            <button 
              className="apply-btn"
              onClick={() => setApplying(true)}
            >
              Apply Now
            </button>
          )}
          
          {hasApplied && userApplication && (
            <section className="application-status">
              <h2>Your Application Status</h2>
              <div className={`status ${userApplication.status}`}>
                {userApplication.status}
              </div>
              {userApplication.feedback && (
                <div className="feedback">
                  <h3>Feedback</h3>
                  <p>{userApplication.feedback.content}</p>
                </div>
              )}
            </section>
          )}
        </div>

        {isOwner && (
          <div className="applications-panel">
            <h2>Applications ({opportunity.applications?.length || 0})</h2>
            {opportunity.applications?.map(application => (
              <div key={application._id} className="application-card">
                <div className="applicant-info">
                  <h3>{application.student.name}</h3>
                  <span className={`status ${application.status}`}>
                    {application.status}
                  </span>
                </div>
                <p>{application.statement}</p>
                {application.cv && (
                  <a 
                    href={application.cv.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cv-link"
                  >
                    View CV
                  </a>
                )}
                {application.status === 'pending' && (
                  <div className="review-actions">
                    <button
                      onClick={() => handleReview(
                        application._id,
                        'accepted',
                        'Congratulations! Your application has been accepted.'
                      )}
                      className="accept-btn"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReview(
                        application._id,
                        'rejected',
                        'Thank you for your interest, but we have decided to move forward with other candidates.'
                      )}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {applying && (
        <div className="modal">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setApplying(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Apply for Position</h2>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Statement of Interest</label>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
              <div className="form-group">
                <label>CV (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setCV(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setApplying(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDetail;