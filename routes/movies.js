const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const validator = require('validator');
const {
  findMovies,
  createMovie,
  deletMovie,
} = require('../controllers/movies');

// const isMail = (value) => {
//   const result = validator.isEmail(value);
//   if (result) {
//     return value;
//   }
//   throw new Error('URL validation err');
// };

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer,
//  nameRU, nameEN и thumbnail, movieId
// POST /movies

router.get('/', findMovies);
router.post('/', createMovie);
router.delete('/:_id', deletMovie);

module.exports = router;
