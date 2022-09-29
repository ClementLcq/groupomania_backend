const Post = require('../models/Post')
const fs = require('fs');

// Controllers

// Afficher toutes les posts

exports.displayPosts = (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

// Créer un post

// exports.createPost = (req, res, next) => {
//     console.log(JSON.parse(req.body.post));
//     const postObject = JSON.parse(req.body.post);
//     delete postObject._id;
//     const post = new Post({
//         ...postObject,
//         imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     });
//     post.save()
//         .then(() => res.status(201).json({ message: 'Objet enregistré' }))
//         .catch(error => res.status(400).json({ error }));
// };

exports.createPost = async (req, res) => {
    const { userId, description } = req.body;
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : "";
    await Post.create({
      userId: userId,
      description: description,
      image: imageURL,
    })
      .then(() => {
        res.status(201).json({ message: "Nouveau Post créé !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  };

// Modifier un post

exports.modifyPost = (req, res, next) => {
    const postObject = req.file ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    delete postObject._userId;
    Post.findOne({_id: req.params.id})
        .then((post) => {
            if (post == null) {
                res.status(404).json({ message: "Le post n'existe pas" });
            } else if (post.userId != req.auth.userId) {
                res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post" });
            } else {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.updateOne({ _id: req.params.id }, {...postObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        });
}

// Supprimer un post

exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (post == null) {
                res.status(404).json({ message: "Le post n'existe pas" });
            } else if (post.userId != req.auth.userId) {
                res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer le post" });
            } else {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};