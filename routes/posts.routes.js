const express = require('express');
var router = express.Router();

// Controlleurs et middlewaires

const postCtrl = require('../controllers/posts.controller');
// const auth = require('../middleware/auth.middleware');
const multer = require("../middleware/multerFunctions");


// Routes CRUD

router.get("/", postCtrl.displayPosts);
router.post("/", multer, postCtrl.createPost);
router.put("/:id", postCtrl.modifyPost);
router.delete("/:id", postCtrl.deletePost);



module.exports = router;