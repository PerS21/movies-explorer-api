const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const validator = require('validator');
const {
  findByIdAndUpdateUser,
  findById,
} = require('../controllers/users');

const isMail = (value) => {
  const result = validator.isEmail(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

router.get('/me', findById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(isMail),
  }),
}), findByIdAndUpdateUser);

module.exports = router;
