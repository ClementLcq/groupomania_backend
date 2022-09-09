const Post = require('../models/Post')
const fs = require('fs');

// Controllers

// Afficher toutes les posts

exports.displayPosts = (req, res, next) => {
    Sauce.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};