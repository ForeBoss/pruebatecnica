const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.get('/data', userController.getUsers);

module.exports = router;