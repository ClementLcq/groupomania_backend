const express = require('express');
const router = express.Router();

// Controlleurs et middlewaires

const postCtrl = require('../controllers/posts.controller');

// Routes CRUD

router.get('/trending', auth, postCtrl.displayPosts);


module.exports = router;