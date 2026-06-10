const { Router } = require('express');
const { getUser, logout } = require('../controllers/user.controller.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');

const router = Router();

router.use(verifyToken);
router.route('/logout').post(logout);
router.route('/profile').get(getUser);

module.exports = router;