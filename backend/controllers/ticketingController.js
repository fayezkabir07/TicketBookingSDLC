const { Movie, TicketBooking } = require("../models/ticketbooking");

const defaultMovies = [
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space.",
    rating: 8.7,
    durationMinutes: 169,
    language: "English",
    showTimes: ["10:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"],
    posterUrl: "https://placehold.co/600x400?text=Interstellar"
  },
  {
    title: "Inception",
    description: "A thief enters dreams to steal and plant ideas.",
    rating: 8.8,
    durationMinutes: 148,
    language: "English",
    showTimes: ["9:30 AM", "1:00 PM", "5:00 PM", "9:15 PM"],
    posterUrl: "https://placehold.co/600x400?text=Inception"
  },
  {
    title: "The Dark Knight",
    description: "Batman faces the Joker in Gotham's darkest hour.",
    rating: 9.0,
    durationMinutes: 152,
    language: "English",
    showTimes: ["11:00 AM", "3:30 PM", "7:30 PM"],
    posterUrl: "https://placehold.co/600x400?text=Dark+Knight"
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with the Fremen for revenge.",
    rating: 8.6,
    durationMinutes: 166,
    language: "English",
    showTimes: ["12:00 PM", "4:00 PM", "8:30 PM"],
    posterUrl: "https://placehold.co/600x400?text=Dune+2"
  },
  {
    title: "Gladiator II",
    description: "Lucius takes up the sword to fight tyranny in Rome's Colosseum.",
    rating: 8.2,
    durationMinutes: 148,
    language: "English",
    showTimes: ["11:00 AM", "3:00 PM", "7:00 PM"],
    posterUrl: "https://placehold.co/600x400?text=Gladiator+II",
    isUpcoming: true,
    releaseDate: "Nov 2025"
  },
  {
    title: "Deadpool & Wolverine",
    description: "Wade Wilson teams up with Wolverine for a multiverse-saving mission.",
    rating: 8.4,
    durationMinutes: 127,
    language: "English",
    showTimes: ["10:30 AM", "2:30 PM", "6:30 PM"],
    posterUrl: "https://placehold.co/600x400?text=Deadpool+%26+Wolverine",
    isUpcoming: true,
    releaseDate: "Dec 2025"
  },
  {
    title: "Furiosa",
    description: "The origin story of Furiosa's journey across the wasteland.",
    rating: 8.0,
    durationMinutes: 149,
    language: "English",
    showTimes: ["12:00 PM", "4:30 PM", "9:00 PM"],
    posterUrl: "https://placehold.co/600x400?text=Furiosa",
    isUpcoming: true,
    releaseDate: "Jan 2026"
  },
  {
    title: "Kingdom of the Planet of the Apes",
    description: "A new ape leader rises as civilizations clash in a post-human world.",
    rating: 7.9,
    durationMinutes: 145,
    language: "English",
    showTimes: ["1:00 PM", "5:00 PM", "9:30 PM"],
    posterUrl: "https://placehold.co/600x400?text=Planet+of+the+Apes",
    isUpcoming: true,
    releaseDate: "Feb 2026"
  }
];

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const seedMoviesIfNeeded = async () => {
  const count = await Movie.countDocuments();
  if (count === 0) {
    await Movie.insertMany(defaultMovies);
  }
};

const getMovies = asyncHandler(async (_req, res) => {
  await seedMoviesIfNeeded();
  const movies = await Movie.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: movies.length,
    data: movies
  });
});

const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.movieId);
  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found."
    });
  }

  res.status(200).json({
    success: true,
    data: movie
  });
});

const getBookedSeatsForShow = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { showTime } = req.query;

  if (!showTime) {
    return res.status(400).json({
      success: false,
      message: "showTime query parameter is required."
    });
  }

  const bookings = await TicketBooking.find({
    movie: movieId,
    showTime
  }).select("seatNumbers");

  const bookedSeats = bookings.flatMap((booking) => booking.seatNumbers || []);

  res.status(200).json({
    success: true,
    count: bookedSeats.length,
    data: bookedSeats
  });
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await TicketBooking.find({ user: req.user._id })
    .populate("movie", "title rating showTimes")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

const createBooking = asyncHandler(async (req, res) => {
  const { movieId, showTime, seatNumbers } = req.body;

  if (!movieId || !showTime || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "movieId, showTime and seatNumbers are required."
    });
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found for booking."
    });
  }

  if (!movie.showTimes.includes(showTime)) {
    return res.status(400).json({
      success: false,
      message: "Selected show time is not available for this movie."
    });
  }

  const normalizedSeats = [...new Set(seatNumbers.map((seat) => String(seat).trim().toUpperCase()))];

  const overlappingBooking = await TicketBooking.findOne({
    movie: movieId,
    showTime,
    seatNumbers: { $in: normalizedSeats }
  });

  if (overlappingBooking) {
    return res.status(409).json({
      success: false,
      message: "One or more selected seats are already booked for this show."
    });
  }

  const booking = await TicketBooking.create({
    user: req.user._id,
    movie: movieId,
    showTime,
    seatNumbers: normalizedSeats
  });

  const populatedBooking = await TicketBooking.findById(booking._id).populate(
    "movie",
    "title rating showTimes"
  );

  res.status(201).json({
    success: true,
    message: "Ticket booked successfully.",
    data: populatedBooking
  });
});

const updateBooking = asyncHandler(async (req, res) => {
  const { showTime, seatNumbers, completed } = req.body;
  const booking = await TicketBooking.findOne({
    _id: req.params.bookingId,
    user: req.user._id
  }).populate("movie");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  if (showTime && !booking.movie.showTimes.includes(showTime)) {
    return res.status(400).json({
      success: false,
      message: "Selected show time is not available for this movie."
    });
  }
  const nextShowTime = showTime ?? booking.showTime;
  const nextSeatNumbers = Array.isArray(seatNumbers) && seatNumbers.length
    ? [...new Set(seatNumbers.map((seat) => String(seat).trim().toUpperCase()))]
    : booking.seatNumbers;

  const overlappingBooking = await TicketBooking.findOne({
    _id: { $ne: booking._id },
    movie: booking.movie._id,
    showTime: nextShowTime,
    seatNumbers: { $in: nextSeatNumbers }
  });

  if (overlappingBooking) {
    return res.status(409).json({
      success: false,
      message: "One or more selected seats are already booked for this show."
    });
  }

  booking.showTime = nextShowTime;
  booking.seatNumbers = nextSeatNumbers;
  booking.completed = typeof completed === "boolean" ? completed : booking.completed;

  const updatedBooking = await booking.save();
  await updatedBooking.populate("movie", "title rating showTimes");

  res.status(200).json({
    success: true,
    message: "Booking updated successfully.",
    data: updatedBooking
  });
});

const toggleBookingCompleted = asyncHandler(async (req, res) => {
  const booking = await TicketBooking.findOne({
    _id: req.params.bookingId,
    user: req.user._id
  });
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  booking.completed = !booking.completed;
  await booking.save();
  await booking.populate("movie", "title rating showTimes");

  res.status(200).json({
    success: true,
    message: `Booking marked as ${booking.completed ? "completed" : "pending"}.`,
    data: booking
  });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await TicketBooking.findOne({
    _id: req.params.bookingId,
    user: req.user._id
  });
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found."
    });
  }

  await booking.deleteOne();

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully."
  });
});

module.exports = {
  getMovies,
  getMovieById,
  getBookedSeatsForShow,
  getBookings,
  createBooking,
  updateBooking,
  toggleBookingCompleted,
  deleteBooking
};
