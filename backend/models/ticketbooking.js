const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 30
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    showTimes: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one show time is required."
      }
    },
    posterUrl: {
      type: String,
      default: "https://placehold.co/600x400?text=Movie+Poster"
    }
  },
  { timestamps: true }
);

const ticketBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    showTime: {
      type: String,
      required: true
    },
    seatNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0 && value.length <= 8,
        message: "Please select 1 to 8 seats."
      }
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    }
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
const TicketBooking = mongoose.model("TicketBooking", ticketBookingSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
  Movie,
  TicketBooking,
  User
};
