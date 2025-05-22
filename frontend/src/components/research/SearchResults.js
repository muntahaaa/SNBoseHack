import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(data.results || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="search-results">
      <h2>Search Results for: {query}</h2>
      {results.length === 0 ? (
        <p>No results found for your search.</p>
      ) : (
        <div className="results-grid">
          {results.map((result) => (
            <div key={result.id} className="result-card">
              <h3>{result.title}</h3>
              <p>{result.description}</p>
              <span className="result-type">{result.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;