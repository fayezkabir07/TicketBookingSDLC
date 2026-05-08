import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createBooking,
  deleteBooking,
  getBookings,
  getMovies,
  login,
  signup,
  toggleBookingCompleted,
  updateBooking
} from "./api/ticketingApi";
import AuthForm from "./components/AuthForm";
import MovieList from "./components/MovieList";
import BookingForm from "./components/BookingForm";
import BookingsList from "./components/BookingsList";
import "./App.css";

function AppHeader({ authUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-shell app-header-inner">
        <h1>CineSeat</h1>
        <div className="header-nav">
          <span>Movie Ticket Booking</span>
          {authUser ? <span className="pill">Hi, {authUser.name}</span> : null}
          {!authUser ? (
            <>
              <button
                className="secondary-btn"
                type="button"
                onClick={() => navigate("/auth?mode=login")}
              >
                Login
              </button>
              <button
                className="primary-btn"
                type="button"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button className="secondary-btn" type="button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-shell">
        <p>© {new Date().getFullYear()} CineSeat. All rights reserved.</p>
      </div>
    </footer>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [greetingData, setGreetingData] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    const raw = localStorage.getItem("ticketing_user");
    return raw ? JSON.parse(raw) : null;
  });

  const loadInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const [moviesResponse, bookingsResponse] = await Promise.all([
        getMovies(),
        authUser ? getBookings() : Promise.resolve({ data: { data: [] } })
      ]);

      setMovies(moviesResponse.data.data || []);
      setBookings(bookingsResponse.data.data || []);
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Failed to load data. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [authUser]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSelectMovie = (movie) => {
    clearMessages();
    setGreetingData(null);
    setEditingBooking(null);

    if (!authUser) {
      navigate("/auth?mode=login");
      return;
    }

    navigate(`/movies/${movie._id}`);
  };

  const handleAuthSubmit = async (formData) => {
    clearMessages();
    setAuthSubmitting(true);
    try {
      const apiCall = authMode === "signup" ? signup : login;
      const response = await apiCall(formData);
      const { token, user } = response.data.data;

      localStorage.setItem("ticketing_token", token);
      localStorage.setItem("ticketing_user", JSON.stringify(user));
      setAuthUser(user);
      setSuccess(
        authMode === "signup"
          ? "Signup successful. You can now book tickets."
          : "Login successful."
      );
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Authentication failed.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ticketing_token");
    localStorage.removeItem("ticketing_user");
    setAuthUser(null);
    setBookings([]);
    setEditingBooking(null);
    setGreetingData(null);
    setSuccess("Logged out successfully.");
    navigate("/");
  };

  const handleEditBooking = (booking) => {
    clearMessages();
    setGreetingData(null);
    setEditingBooking(booking);
    navigate(`/movies/${booking.movie?._id}`, { state: { editBookingId: booking._id } });
  };

  const handleDeleteBooking = async (bookingId) => {
    clearMessages();
    setLoadingActionId(bookingId);
    try {
      await deleteBooking(bookingId);
      setSuccess("Booking deleted successfully.");
      await loadInitialData();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Delete failed.");
    } finally {
      setLoadingActionId("");
    }
  };

  const handleToggleCompleted = async (bookingId) => {
    clearMessages();
    setLoadingActionId(bookingId);
    try {
      await toggleBookingCompleted(bookingId);
      setSuccess("Booking status updated.");
      await loadInitialData();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not toggle status.");
    } finally {
      setLoadingActionId("");
    }
  };

  const HomePage = () => (
    <>
      {!loading ? <MovieList movies={movies} onSelectMovie={handleSelectMovie} /> : null}

      {!loading && authUser ? (
        <BookingsList
          bookings={bookings}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
          onToggleCompleted={handleToggleCompleted}
          loadingActionId={loadingActionId}
        />
      ) : null}
    </>
  );

  const AuthPage = () => {
    if (authUser) return <Navigate to="/" replace />;
    const isSignup = new URLSearchParams(location.search).get("mode") === "signup";
    const currentMode = isSignup ? "signup" : "login";

    return (
      <AuthForm
        mode={currentMode}
        onSubmit={handleAuthSubmit}
        isSubmitting={authSubmitting}
        onToggleMode={() =>
          navigate(`/auth?mode=${currentMode === "login" ? "signup" : "login"}`)
        }
      />
    );
  };

  const MovieDetailsPage = () => {
    const { movieId } = useParams();
    const selectedMovie = movies.find((movie) => movie._id === movieId);

    if (!authUser) return <Navigate to="/auth?mode=login" replace />;

    if (!selectedMovie) {
      return (
        <section className="panel">
          <h2>Movie not found</h2>
          <button className="secondary-btn" type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </section>
      );
    }

    const bookingFromStateId = location.state?.editBookingId;
    const activeEditingBooking =
      bookingFromStateId && editingBooking?._id === bookingFromStateId
        ? editingBooking
        : null;

    const handleCreateOrUpdate = async (formData) => {
      clearMessages();
      setSubmitting(true);
      try {
        if (activeEditingBooking) {
          await updateBooking(activeEditingBooking._id, formData);
          setSuccess("Booking updated successfully.");
          setEditingBooking(null);
        } else {
          const createResponse = await createBooking({
            movieId: selectedMovie._id,
            showTime: formData.showTime,
            seatNumbers: formData.seatNumbers
          });
          const booking = createResponse.data.data;
          setSuccess("Ticket booked successfully.");
          setGreetingData({
            customerName: authUser?.name || "User",
            movieTitle: booking.movie?.title || selectedMovie.title,
            showTime: booking.showTime,
            seatCount: (booking.seatNumbers || []).length
          });
        }

        await loadInitialData();
        navigate("/");
      } catch (apiError) {
        setError(
          apiError?.response?.data?.message || "Could not save booking. Try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="layout-grid details-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.description}</p>
          </div>
          <div className="movie-meta">
            <span>Rating: {selectedMovie.rating}/10</span>
            <span>{selectedMovie.durationMinutes} mins</span>
            <span>{selectedMovie.language}</span>
          </div>
          <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="detail-poster" />
        </section>

        <BookingForm
          selectedMovie={selectedMovie}
          editingBooking={activeEditingBooking}
          onSubmit={handleCreateOrUpdate}
          onCancelEdit={() => {
            setEditingBooking(null);
            navigate("/");
          }}
          isSubmitting={submitting}
        />
      </div>
    );
  };

  return (
    <>
      <AppHeader authUser={authUser} onLogout={handleLogout} />
      <main className="app-shell app-container">
        <section className="panel hero">
          <p>Select a movie to go to details page and choose time slot and seats.</p>
        </section>

      {loading ? <p className="status loading">Loading movies and bookings...</p> : null}
      {error ? <p className="status error">{error}</p> : null}
      {success ? <p className="status success">{success}</p> : null}

      {greetingData ? (
        <section className="panel greeting-panel">
          <h2>Booking Confirmed</h2>
          <p>
            Thank you, <strong>{greetingData.customerName}</strong>!
          </p>
          <p>
            Your booking for <strong>{greetingData.movieTitle}</strong> at{" "}
            <strong>{greetingData.showTime}</strong> ({greetingData.seatCount} seats) is
            confirmed.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => setGreetingData(null)}
          >
            Book Another Movie
          </button>
        </section>
      ) : null}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppFooter />
    </>
  );
}

export default App;
