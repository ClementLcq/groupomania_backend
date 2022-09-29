const mongoose = require('mongoose');

// Création du schéma Post attendu par le front

const postSchema = mongoose.Schema({
        userId: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        likes: { type: Number, required: false, default: 0 },
        usersLiked: { type: [String] },
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);