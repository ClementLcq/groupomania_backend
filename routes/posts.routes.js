const express = require('express');
const router = express.Router();

// Controlleurs et middlewaires

const postCtrl = require('../controllers/posts.controller');
const auth = require('../middleware/auth.middleware');
const multer = require("../middleware/multerFunctions");


// Routes CRUD

router.post("/trending", auth, multer, postCtrl.createPost);
router.get('/trending', auth, postCtrl.displayPosts);
router.delete("/trending/:id", auth, postCtrl.deletePost);
router.put("/trending/:id", auth, multer, postCtrl.modifyPost);


module.exports = router;