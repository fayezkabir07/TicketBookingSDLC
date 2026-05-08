const express = require("express");
const {
  getMovies,
  getMovieById,
  getBookedSeatsForShow,
  getBookings,
  createBooking,
  updateBooking,
  toggleBookingCompleted,
  deleteBooking
} = require("../controllers/ticketingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/movies", getMovies);
router.get("/movies/:movieId", getMovieById);
router.get("/movies/:movieId/seats", protect, getBookedSeatsForShow);

router.get("/bookings", protect, getBookings);
router.post("/bookings", protect, createBooking);
router.put("/bookings/:bookingId", protect, updateBooking);
router.patch("/bookings/:bookingId/toggle-completed", protect, toggleBookingCompleted);
router.delete("/bookings/:bookingId", protect, deleteBooking);

module.exports = router;
