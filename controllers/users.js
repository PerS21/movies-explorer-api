const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCreating = require('../utils/errors/errorCreating');
const UserDuplicate = require('../utils/errors/userDublicate');
const UpdateError = require('../utils/errors/updateError');
const ValidationError = require('../utils/errors/validationError');
const ParamsError = require('../utils/errors/paramsError');
const FoundError = require('../utils/errors/notFound');

const {
  JWT_SECRET = 'pers',
} = process.env;

const saltRounds = 10;

module.exports.findByIdAndUpdateUser = (req, res, next) => {
  const {
    email,
  } = req.body;
  User.findOne({
    email,
  }).then((user) => {
    if (user) {
      return next(new UserDuplicate('Пользователь с такой очтой уже существует'));
    }
    return User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      email: req.body.email,
    }, {
      new: true,
      runValidators: true,
    })
      .then((us) => {
        if (!us) {
          throw new FoundError('Запрашиваемый пользователь не найден');
        }
        res.send(us);
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          next(new UpdateError('Ошибка при обновлении'));
        }
        if (error.name === 'ValidationError') {
          return next(new ValidationError('Ошибка запроса'));
        }
        return next(error);
      });
  })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new UpdateError('Ошибка при обновлении'));
      }
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Ошибка запроса'));
      }
      return next(error);
    });
};

module.exports.findById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new UpdateError('Ошибка при обновлении'));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User.findOne({
    email,
  })
    .then((user) => {
      if (!validator.isEmail(email)) {
        return next(new ErrorCreating('Невалидная почта'));
      }
      if (user) {
        return next(new UserDuplicate('Пользователь с такой очтой уже существует'));
      }
      return bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return next(new ErrorCreating('Ошибка при создании'));
        return User.create({
          name,
          email,
          password: hash,
        })
          .then((userNew) => res.send({
            data: {
              name: userNew.name,
              about: userNew.about,
              avatar: userNew.avatar,
              email: userNew.email,
            },
          }));
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorCreating('Ошибка при создании'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({
    email,
  }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new ParamsError('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).send({
            message: 'Ошибка проверки',
          });
        }

        if (!result) {
          return next(new ParamsError('Неправильная почта или пароль'));
        }

        const token = jwt.sign({
          id: user._id,
        }, JWT_SECRET, {
          expiresIn: '1w',
        });

        return res
          .send({
            jwt: token,
            _id: user._id,
            email: user.email,
          });
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationError('Ошибка запроса'));
      } else {
        next(error);
      }
    });
};
