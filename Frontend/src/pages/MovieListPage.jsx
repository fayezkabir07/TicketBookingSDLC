import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies, getUpcomingMovies } from '../services/api';

const PLACEHOLDER_POSTER = 'https://via.placeholder.com/300x450?text=No+Image';

function formatReleaseDate(dateStr) {
  if (!dateStr) return 'TBA';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function MovieListPage() {
  const navigate = useNavigate();

  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loadingNow, setLoadingNow] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [errorNow, setErrorNow] = useState('');
  const [errorUpcoming, setErrorUpcoming] = useState('');

  useEffect(() => {
    getMovies()
      .then((res) => setNowShowing(res.data || []))
      .catch(() => setErrorNow('Failed to load movies.'))
      .finally(() => setLoadingNow(false));

    getUpcomingMovies()
      .then((res) => setUpcoming(res.data || []))
      .catch(() => setErrorUpcoming('Failed to load upcoming movies.'))
      .finally(() => setLoadingUpcoming(false));
  }, []);

  return (
    <div className="page">
      {/* Now Showing */}
      <h2 className="section-heading">Now Showing</h2>
      {loadingNow && <p className="loading-text">Loading movies...</p>}
      {errorNow && <p className="error-msg">{errorNow}</p>}
      {!loadingNow && !errorNow && nowShowing.length === 0 && (
        <p className="empty-text">No movies currently showing.</p>
      )}
      {!loadingNow && nowShowing.length > 0 && (
        <div className="movies-grid">
          {nowShowing.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => navigate(`/movies/${movie._id}`)}
            >
              <img
                src={movie.poster || PLACEHOLDER_POSTER}
                alt={movie.title}
                onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
              />
              <div className="movie-card-info">
                <div className="movie-card-title">{movie.title}</div>
                <div className="movie-card-genre">{movie.genre}</div>
                <button
                  className="btn-book"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movies/${movie._id}`);
                  }}
                >
                  Book Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Movies */}
      <div className="upcoming-section">
        <h2 className="section-heading">Upcoming Movies</h2>
        {loadingUpcoming && <p className="loading-text">Loading upcoming movies...</p>}
        {errorUpcoming && <p className="error-msg">{errorUpcoming}</p>}
        {!loadingUpcoming && !errorUpcoming && upcoming.length === 0 && (
          <p className="empty-text">No upcoming movies at this time.</p>
        )}
        {!loadingUpcoming && upcoming.length > 0 && (
          <div className="upcoming-movies-grid">
            {upcoming.map((movie) => (
              <div key={movie._id} className="upcoming-movie-card">
                <img
                  src={movie.poster || PLACEHOLDER_POSTER}
                  alt={movie.title}
                  onError={(e) => { e.target.src = PLACEHOLDER_POSTER; }}
                />
                <div className="upcoming-card-info">
                  <div className="upcoming-card-title">{movie.title}</div>
                  <div className="genre-badge">{movie.genre}</div>
                  <div className="release-date-label">
                    Release: <span>{formatReleaseDate(movie.releaseDate)}</span>
                  </div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
