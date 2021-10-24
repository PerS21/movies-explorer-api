const jwt = require('jsonwebtoken');
const ParamsError = require('../utils/errors/paramsError');

const {
  JWT_SECRET = 'pers',
} = process.env;

module.exports = (req, res, next) => {
  const {
    authorization,
  } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ParamsError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new ParamsError('Ошибка токена'));

    req.user = {

      _id: decoded.id,

    };
  });

  next();
};
