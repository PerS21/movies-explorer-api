const router = require('express').Router();
const {
  findByIdAndUpdateUser,
  findById,
} = require('../controllers/users');
const {
  userUpdateValidation,
} = require('../middlewares/validation');

router.get('/users/me', findById);
router.patch('/users/me', userUpdateValidation, findByIdAndUpdateUser);

module.exports = router;
