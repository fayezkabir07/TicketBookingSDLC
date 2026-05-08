function MovieList({ movies, onSelectMovie }) {
  const nowShowing = movies.filter((m) => !m.isUpcoming);
  const upcoming = movies.filter((m) => m.isUpcoming);

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <h2>Now Showing</h2>
          <p>Choose a movie to start your booking.</p>
        </div>

        <div className="movie-grid">
          {nowShowing.map((movie) => (
            <article key={movie._id} className="movie-card">
              <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
              <div className="movie-body">
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
                <div className="movie-meta">
                  <span>Rating: {movie.rating}/10</span>
                  <span>{movie.durationMinutes} mins</span>
                  <span>{movie.language}</span>
                </div>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => onSelectMovie(movie)}
                >
                  View Details &amp; Book
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="upcoming-section">
          <div className="panel-header">
            <h2>Upcoming Movies</h2>
            <p>Stay tuned — these titles are coming soon.</p>
          </div>

          <div className="movie-grid">
            {upcoming.map((movie) => (
              <article key={movie._id} className="movie-card">
                <div className="movie-poster-wrapper">
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                  <span className="upcoming-badge">Upcoming</span>
                </div>
                <div className="movie-body">
                  <h3>{movie.title}</h3>
                  <p>{movie.description}</p>
                  <div className="movie-meta">
                    <span>Rating: {movie.rating}/10</span>
                    <span>{movie.durationMinutes} mins</span>
                    <span>{movie.language}</span>
                    {movie.releaseDate && (
                      <span className="release-date-tag">Coming Soon · {movie.releaseDate}</span>
                    )}
                  </div>
                  <button type="button" className="coming-soon-btn" disabled>
                    Coming Soon
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default MovieList;
