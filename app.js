require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const {
  celebrate,
  errors,
  Joi,
} = require('celebrate');
const validator = require('validator');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

// Слушаем 3000 порт
const {
  PORT = 3000,
} = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/movie');

app.use(express.json());

module.exports.createCard = (req, res) => {};

app.use(requestLogger);

const corsOptions = {
  origin: ['*'],
  optionsSuccessStatus: 200,
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const {
    statusCode = 500, message = 'Ошибка на сервере',
  } = err;
  res.status(statusCode).send({
    message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
