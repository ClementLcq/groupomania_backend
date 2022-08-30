var express = require('express');
var router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Import du validateur de mot de passe

const password = require('../middleware/passwordValidator.middleware');

/* GET users listing. */
router.post('/signup', password, authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;
