import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ActorDetailPage() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchActor() {
      try {
        const url = `https://api.themoviedb.org/3/person/${id}?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success === false || data.status_code) {
          setError('Actor not found');
        } else {
          setActor(data);
        }
      } catch (err) {
        setError('Failed to fetch actor detail');
      }
    }
    fetchActor();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!actor) return <p>Loading actor...</p>;

  // Пример полей:
  const {
    name,
    biography,
    place_of_birth,
    profile_path,
    birthday,
    deathday,
    also_known_as,
    known_for_department,
    homepage,
  } = actor;

  // Вывод:
  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '250px', maxWidth: '300px' }}>
          {profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${profile_path}`}
              alt={name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ) : (
            <div style={{ width: '100%', height: '450px', backgroundColor: '#333', borderRadius: '8px' }}>
              No Image
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2>{name}</h2>
          {also_known_as && also_known_as.length > 0 && (
            <p><strong>Also Known As:</strong> {also_known_as.join(', ')}</p>
          )}
          <p><strong>Department:</strong> {known_for_department}</p>
          <p><strong>Birthday:</strong> {birthday || 'N/A'} {deathday && ` - † ${deathday}`}</p>
          {place_of_birth && (
            <p><strong>Place of Birth:</strong> {place_of_birth}</p>
          )}
          {homepage && (
            <p>
              <strong>Homepage:</strong>{' '}
              <a href={homepage} style={{ color: '#FFD700' }} target="_blank" rel="noreferrer">
                {homepage}
              </a>
            </p>
          )}
          <p><strong>Biography:</strong> {biography || 'No biography available'}</p>
        </div>
      </div>
    </div>
  );
}

export default ActorDetailPage;
