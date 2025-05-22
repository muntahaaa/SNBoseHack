import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ResearchHome = () => {
  const { user } = useContext(AuthContext);
  const isResearcher = user?.role === 'researcher';

  // Placeholder data - will be replaced with real data from API
  const [trendingThoughts] = useState([
    { id: 1, title: 'Quantum Computing Breakthrough', author: 'Dr. Smith', likes: 45 },
    { id: 2, title: 'New Approach to Dark Matter', author: 'Dr. Johnson', likes: 38 },
    { id: 3, title: 'Machine Learning in Physics', author: 'Prof. Wilson', likes: 32 }
  ]);

  const [activeSubmissions] = useState([
    { id: 1, title: 'Particle Physics Challenge', submissions: 12, daysLeft: 5 },
    { id: 2, title: 'Data Analysis Project', submissions: 8, daysLeft: 3 }
  ]);

  const [volunteerPosts] = useState([
    { id: 1, title: 'Lab Assistant Needed', positions: 2, applicants: 5 },
    { id: 2, title: 'Research Data Analyst', positions: 1, applicants: 3 }
  ]);

  return (
    <div className="research-home">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1>Research Deck</h1>
        <p className="banner-text">
          {isResearcher 
            ? "Welcome back! Manage your research activities and engage with students."
            : "Discover exciting research opportunities and contribute to groundbreaking projects."}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {isResearcher ? (
          <>
            <Link to="/research/thoughts/new" className="action-card researcher">
              <h3>Share Research Insight</h3>
              <p>Post your latest research findings or ideas</p>
            </Link>
            <Link to="/research/challenges/new" className="action-card researcher">
              <h3>Create Challenge</h3>
              <p>Set up a new research challenge</p>
            </Link>
            <Link to="/research/volunteer/new" className="action-card researcher">
              <h3>Post Opportunity</h3>
              <p>Find volunteers for your project</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/research/thoughts" className="action-card student">
              <h3>Explore Research</h3>
              <p>Discover new research insights</p>
            </Link>
            <Link to="/research/challenges" className="action-card student">
              <h3>Take a Challenge</h3>
              <p>Test your research skills</p>
            </Link>
            <Link to="/research/volunteer" className="action-card student">
              <h3>Find Opportunities</h3>
              <p>Join research projects</p>
            </Link>
          </>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Trending Research Thoughts */}
        <section className="dashboard-section trending-thoughts">
          <div className="section-header">
            <h2>Trending Research Thoughts</h2>
            <Link to="/research/thoughts" className="see-all">See All</Link>
          </div>
          <div className="content-cards">
            {trendingThoughts.map(thought => (
              <Link key={thought.id} to={`/research/thoughts/${thought.id}`} className="thought-card">
                <h3>{thought.title}</h3>
                <div className="card-meta">
                  <span>{thought.author}</span>
                  <span>{thought.likes} likes</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Active Challenges */}
        <section className="dashboard-section active-challenges">
          <div className="section-header">
            <h2>{isResearcher ? 'Your Active Challenges' : 'Open Challenges'}</h2>
            <Link to="/research/challenges" className="see-all">See All</Link>
          </div>
          <div className="content-cards">
            {activeSubmissions.map(challenge => (
              <Link key={challenge.id} to={`/research/challenges/${challenge.id}`} className="challenge-card">
                <h3>{challenge.title}</h3>
                <div className="card-meta">
                  <span>{challenge.submissions} submissions</span>
                  <span>{challenge.daysLeft} days left</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="dashboard-section volunteer-posts">
          <div className="section-header">
            <h2>{isResearcher ? 'Your Volunteer Posts' : 'Latest Opportunities'}</h2>
            <Link to="/research/volunteer" className="see-all">See All</Link>
          </div>
          <div className="content-cards">
            {volunteerPosts.map(post => (
              <Link key={post.id} to={`/research/volunteer/${post.id}`} className="volunteer-card">
                <h3>{post.title}</h3>
                <div className="card-meta">
                  <span>{post.positions} positions</span>
                  <span>{post.applicants} applicants</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="dashboard-section activity-timeline">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="timeline">
            <p className="empty-state">Activity timeline coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResearchHome;