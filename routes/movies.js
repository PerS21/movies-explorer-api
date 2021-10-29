const router = require('express').Router();
const {
  findMovies,
  createMovie,
  deletMovie,
} = require('../controllers/movies');
const {
  movieDeleteValidation,
  movieAddValidation,
} = require('../middlewares/validation');

router.get('/movies/', findMovies);
router.post('/movies/', movieAddValidation, createMovie);
router.delete('/movies/:_id', movieDeleteValidation, deletMovie);

module.exports = router;
