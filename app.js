require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const {
  errors,
} = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const {
  DATA_BASE,
  PORT,
} = require('./utils/ConfigEnv');

const app = express();

mongoose.connect(DATA_BASE);

app.use(express.json());

app.use(requestLogger);

const corsOptions = {
  origin: ['http://localhost:3000', 'https://dpers.nomoredomains.monster'],
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
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
