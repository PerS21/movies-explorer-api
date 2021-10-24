const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

const FoundError = require('../utils/errors/notFound');

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('/', (req, res, next) => {
  next(new FoundError('Страница не найдена'));
});

module.exports = router;
