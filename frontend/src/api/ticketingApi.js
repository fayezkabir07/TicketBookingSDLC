import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7500/api/ticketing",
  headers: {
    "Content-Type": "application/json"
  }
});

const authApi = axios.create({
  baseURL: "http://localhost:7500/api/auth",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ticketing_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovies = () => api.get("/movies");
export const getBookedSeats = (movieId, showTime) =>
  api.get(`/movies/${movieId}/seats`, { params: { showTime } });
export const getBookings = () => api.get("/bookings");
export const createBooking = (payload) => api.post("/bookings", payload);
export const updateBooking = (bookingId, payload) =>
  api.put(`/bookings/${bookingId}`, payload);
export const deleteBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);
export const toggleBookingCompleted = (bookingId) =>
  api.patch(`/bookings/${bookingId}/toggle-completed`);
export const signup = (payload) => authApi.post("/signup", payload);
export const login = (payload) => authApi.post("/login", payload);

export default api;
