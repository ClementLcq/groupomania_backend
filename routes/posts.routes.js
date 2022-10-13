const express = require('express');
var router = express.Router();

// Controlleurs et middlewaires

const postCtrl = require('../controllers/posts.controller');
const auth = require('../middleware/auth.middleware');
const multer = require("../middleware/multerFunctions");


// Routes CRUD

router.get("/", auth.requireAuth, postCtrl.displayPosts);
router.post("/", auth.requireAuth, multer, postCtrl.createPost);
router.get("/:id", auth.requireAuth, postCtrl.getOnePost);
router.put("/:id", auth.requireAuth, multer, postCtrl.modifyPost);
router.delete("/:id", auth.requireAuth, multer, postCtrl.deletePost);



module.exports = router;