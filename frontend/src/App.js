import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import TvDetail from './pages/TvDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import PopularPage from './pages/PopularPage';
import TvShowPage from './pages/TvShowsPage';
import FilmPage from './pages/FilmPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BooksPage from './pages/BooksPage';
import BookDetail from './components/BookDetail';
import NewsPage from './pages/NewsPage';
import NewsDetail from './components/NewsDetail';
import TopActorsPage from './pages/TopActorsPage';
import ActorDetailPage from './components/ActorDetail';
import ComingSoonPage from './pages/ComingSoonPage';
import TermPage from './pages/TermPage';
import PrivacyPage from './pages/PrivacyPage';
import FAQPage from './pages/FAQPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="tv/:id" element={<TvDetail />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="popular" element={<PopularPage />} />
            <Route path="tv-shows" element={<TvShowPage />} />
            <Route path="movies" element={<FilmPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="book/:id" element={<BookDetail />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:mediaType/:id" element={<NewsDetail />} />
            <Route path="top-actors" element={<TopActorsPage />} />
            <Route path="actor/:id" element={<ActorDetailPage />} />
            <Route path="coming-soon" element={<ComingSoonPage />} />
            <Route path="terms" element={<TermPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="faq" element={<FAQPage />} />
            

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
