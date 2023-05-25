const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require('../controllers/userController');

const router = require('express').Router();

router.post('/login', login);
router.post('/register', register);
router.put('/set-avatar/:id', setAvatar);
router.get('/get-contacts/:id', getAllUsers);
router.get('/logout/:id', logOut);

module.exports = router;
