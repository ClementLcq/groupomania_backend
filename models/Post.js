const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Création du schéma Post attendu par le front

const postSchema = mongoose.Schema({
        userId: { type: Schema.Types.ObjectId, ref : 'users', required: true },
        description: { type: String, required: true },
        imageUrl: { type: String},
        likes: { type: Number, required: false, default: 0 },
        dislikes: { type: Number, required: false, default: 0 },
        usersLiked: { type: [String] },
        usersDisliked: { type: [String] },
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);