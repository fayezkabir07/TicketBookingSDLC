function MovieList({ movies, onSelectMovie }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Now Showing</h2>
        <p>Choose a movie to start your booking.</p>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <article
            key={movie._id}
            className="movie-card"
          >
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
                View Details & Book
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MovieList;
