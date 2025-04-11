// src/apiService.js
const API_KEY = '297abb2aa4a2c8533a6ea80ed32d649f';
const BASE_URL = 'https://api.themoviedb.org/';

export async function searchMovies(searchTerm) {
  const url = `${BASE_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'False') {
    throw new Error(data.Error || 'No movies found.');
  }
  return data.Search; // возвращает массив фильмов
}

export async function getMovieDetails(id) {
  const url = `${BASE_URL}?i=${id}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found.');
  }
  return data; // возвращает объект с данными фильма
}
