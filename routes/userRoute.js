const express = require('express');
const { getUserInfo } = require('../controllers/eventController');
const { registerUser, loginUser } = require('../controllers/userController');
const authUser = require('../middlewares/authUser');

const router = express.Router();

router.get('/info',authUser,getUserInfo);
router.post('/register',registerUser);
router.post('/login',loginUser);


module.exports = router;