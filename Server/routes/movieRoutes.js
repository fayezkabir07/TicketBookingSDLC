const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getUpcomingMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

router.get('/upcoming', getUpcomingMovies);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', protect, createMovie);
router.put('/:id', protect, updateMovie);
router.delete('/:id', protect, deleteMovie);

module.exports = router;
