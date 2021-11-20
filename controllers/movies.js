const Movie = require('../models/movie');
const ErrorCreating = require('../utils/errors/errorCreating');
const FoundError = require('../utils/errors/notFound');
const NotEnoughRights = require('../utils/errors/notEnoughRights');

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
      res.status(200).send(newMovie);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorCreating('Ошибка при создании'));
      } else {
        next(error);
      }
    });
};

module.exports.deletMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params._id).then((movie) => {
    if (movie) {
      const movieOwner = movie.owner.toString();
      if (userId === movieOwner) {
        Movie.findByIdAndRemove(req.params._id)
          .then((mov) => {
            if (mov) {
              res.send({
                message: 'Фильм удален',
              });
            } else {
              next(new FoundError('Фильм не найденвв'));
            }
          });
      } else {
        next(new NotEnoughRights('Недостаточно прав'));
      }
    } else {
      next(new FoundError('Фильм не найден2'));
    }
  })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new FoundError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.findMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({
    userId,
  })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};
