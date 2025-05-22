import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ThoughtsFeed = () => {
  const { user } = useContext(AuthContext);
  const isResearcher = user?.role === 'researcher';
  const [filter, setFilter] = useState('latest');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState({});

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/research/thoughts/${postId}/like`);
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(user._id);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== user._id)
              : [...post.likes, user._id]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const { data } = await axios.post(`/api/research/thoughts/${postId}/comment`, { content });
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, data.comment]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`/api/research/thoughts?filter=${filter}`);
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

  if (loading) {
    return <div className="loading">Loading thoughts...</div>;
  }

  return (
    <div className="thoughts-feed-container">
      <div className="feed-header">
        <div>
          <h1>Research Thoughts</h1>
          <p className="subtitle">
            {isResearcher 
              ? "Share your research ideas and insights with the community"
              : "Explore and engage with research ideas from the community"
            }
          </p>
        </div>
        {isResearcher && (
          <Link to="/research/thoughts/new" className="create-post-btn">
            Share New Thought
          </Link>
        )}
      </div>

      <div className="feed-controls">
        <div className="feed-filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="latest">Latest</option>
            <option value="trending">Trending</option>
            <option value="following">Following</option>
          </select>
        </div>
        <div className="feed-search">
          <input 
            type="text" 
            placeholder="Search thoughts..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map(post => (
            <article key={post._id} className="post-card">
              <div className="post-header">
                <div className="author-info">
                  <img 
                    src={post.author.avatar || '/images/default-avatar.png'} 
                    alt={post.author.name}
                    className="author-avatar" 
                  />
                  <div>
                    <h3 className="author-name">{post.author.name}</h3>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.content.substring(0, 200)}...</p>
              
              <div className="post-actions">
                <button 
                  className={`action-btn like-btn ${post.likes.includes(user._id) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  <span className="icon">❤</span>
                  <span>{post.likes.length}</span>
                </button>
                <button 
                  className="action-btn comment-btn"
                  onClick={() => toggleComments(post._id)}
                >
                  <span className="icon">💭</span>
                  <span>{post.comments.length}</span>
                </button>
                <Link 
                  to={`/research/thoughts/${post._id}`} 
                  className="action-btn read-more"
                >
                  Read More
                </Link>
              </div>

              {showComments[post._id] && (
                <div className="comments-section">
                  {post.comments.map(comment => (
                    <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user.name}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                  <form 
                    className="comment-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const content = e.target.comment.value;
                      if (content.trim()) {
                        handleComment(post._id, content);
                        e.target.comment.value = '';
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="comment"
                      placeholder="Add a comment..."
                      className="comment-input"
                    />
                    <button type="submit" className="comment-submit">
                      Post
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>No thoughts yet</h3>
            <p>
              {isResearcher 
                ? "Be the first to share your research thoughts!"
                : "Check back soon for research insights from our community."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtsFeed;