const Movie = require('../models/movie');
const ErrorCreating = require('../utils/errors/errorCreating');
const FoundError = require('../utils/errors/notFound');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((newMovie) => {
      res.status(200).send({ newMovie });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorCreating('Ошибка при создании'));
      }
      next(error);
    });
};

module.exports.deletMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params._id)
    .then((movie) => {
      if (movie) {
        res.send({
          message: 'Фильм удален',
        });
      } else {
        next(new FoundError('Фильм не найден'));
      }
    });
};

module.exports.findMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find().then((allMovies) => {
    const userMovie = allMovies.filter((movie) => {
      const movieOwner = movie.owner.toString();
      const resalt = (movieOwner === userId);
      return resalt;
    });
    res.send({
      message: userMovie,
    });
  });
};
