import React, { useEffect, useState } from 'react';

function ShowList() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetch('/api/shows')
      .then((res) => res.json())
      .then((data) => setShows(data))
      .catch((error) => console.error('Error fetching shows:', error));
  }, []);

  return (
    <div>
      <h2>Список фильмов</h2>
      <ul>
        {shows.map((show) => (
          <li key={show._id}>
            {show.title} ({show.year}) - {show.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowList;
