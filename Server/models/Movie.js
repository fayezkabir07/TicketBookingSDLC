const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true, default: 'English' },
    duration: { type: Number, required: true },
    releaseDate: { type: Date },
    poster: { type: String },
    cast: [{ type: String }],
    timeSlots: [{ type: String }],
    ticketPrice: { type: Number, default: 250 },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
