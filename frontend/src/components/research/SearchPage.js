import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || 'all',
    department: searchParams.get('department') || '',
    status: searchParams.get('status') || 'active',
    tags: searchParams.get('tags')?.split(',') || [],
    sort: searchParams.get('sort') || 'latest'
  });

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        tags: filters.tags.join(',')
      });
      
      const response = await fetch(`/api/search?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
        setSearchParams(queryParams);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const ResultCard = ({ result }) => (
    <div className="search-result-card">
      <div className="result-type-badge">{result.type}</div>
      <h3 onClick={() => navigate(`/${result.type}/${result._id}`)}>{result.title}</h3>
      <p>{result.description.substring(0, 150)}...</p>
      <div className="result-meta">
        <span>Department: {result.department}</span>
        {result.deadline && (
          <span>Deadline: {new Date(result.deadline).toLocaleDateString()}</span>
        )}
      </div>
      <div className="result-tags">
        {result.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="search-page">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            placeholder="Search by keyword..."
            className="search-input"
          />
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="thought">Thoughts</option>
            <option value="challenge">Challenges</option>
            <option value="volunteer">Volunteer Opportunities</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="all">All Status</option>
          </select>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-select"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
          </select>
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>

      <div className="search-results">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : searchResults.length > 0 ? (
          searchResults.map(result => (
            <ResultCard key={result._id} result={result} />
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;