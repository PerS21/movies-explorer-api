require('dotenv').config();

module.exports = {
  JWT_SECRET: (process.env.NODE_ENV === 'production') ? process.env.JWT_SECRET : 'pers',
  DATA_BASE: (process.env.NODE_ENV === 'production') ? process.env.DATA_BASE : 'mongodb://localhost:27017/movie',
  PORT: (process.env.NODE_ENV === 'production') ? process.env.PORT : 3000,
};
