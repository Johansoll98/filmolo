import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function SearchResultsPage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  useEffect(() => {
    if (!query) return;
    async function fetchData(pageNum) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US&query=${encodeURIComponent(query)}&page=${pageNum}`
        );
        const data = await res.json();
        if (data.results) {
          // Если это первая страница, заменяем результаты, иначе добавляем
          setResults(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
          setTotalPages(data.total_pages);
        } else {
          setError(data.status_message || 'No results found');
        }
      } catch (err) {
        setError('Failed to fetch search results');
      }
    }
    // Сбрасываем страницу, если запрос изменился
    setPage(1);
    fetchData(1);
  }, [query]);

  const loadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US&query=${encodeURIComponent(query)}&page=${nextPage}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setResults(prev => [...prev, ...data.results]);
          }
        })
        .catch((err) => console.error('Error loading more results:', err));
    }
  };

  if (!query) {
    return <p>Please enter a search query.</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {results.map((item) => (
              <div key={item.id} style={{ width: '150px', textAlign: 'center' }}>
                <Link to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}>
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={item.title || item.name}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '225px', backgroundColor: '#444' }}>
                      No Image
                    </div>
                  )}
                </Link>
                <p style={{ marginTop: '5px', fontWeight: 'bold', color: '#fff' }}>
                  {item.title || item.name}
                </p>
              </div>
            ))}
          </div>
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={loadMore} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchResultsPage;
