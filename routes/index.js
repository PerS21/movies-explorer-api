const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const {
  login,
  createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signupValidation, signinValidation } = require('../middlewares/validation');

const FoundError = require('../utils/errors/notFound');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);

router.use(auth, userRouter);
router.use(auth, movieRouter);
router.use('/', (req, res, next) => {
  next(new FoundError('Страница не найдена'));
});

module.exports = router;
