const Post = require('../models/Post')
const fs = require('fs');

// Controllers

// Afficher toutes les posts

exports.displayPosts = (req, res, next) => {
    Post.aggregate([
        { "$lookup": {
          "from": "users",
          "localField": "userId",
          "foreignField": "_id",
          "as": "User"
        }}
      ])
        .sort({createdAt: -1})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

// Afficher un seul post

exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (post == null) {
                res.status(404).json({ message: "Le post n'existe pas" });
            } else {
                res.status(200).json(post)
            }
        })
        .catch(error => res.status(404).json({ error }));
};

// Créer un post


exports.createPost = (req, res, next) => {
    // console.log(JSON.parse(JSON.stringify(req.body)));
    const postObject = JSON.parse(JSON.stringify(req.body));
    delete postObject._id;
    const post = new Post({
        ...postObject,
        imageUrl : req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré' }))
        .catch(error => res.status(400).json({ error }));
};


// exports.createPost = (req, res, next) => {
//     // console.log(JSON.parse(JSON.stringify(req.body)));
//     const content = req.body.post;
//     const post = new Post({
//         userId : req.auth.userId,
//         content : content,
//         imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     });
//     post.save()
//         .then(() => res.status(201).json({ message: 'Objet enregistré' }))
//         .catch(error => res.status(400).json({ error }));
// };

// exports.createPost = async (req, res) => {
//     const { userId, description } = req.body;
//     const imageURL = req.file
//       ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
//       : "";
//     await Post.create({
//       userId: userId,
//       description: description,
//       image: imageURL,
//     })
//       .then(() => {
//         res.status(201).json({ message: "Nouveau Post créé !" });
//       })
//       .catch((error) => {
//         res.status(400).json({ error });
//       });
//   };

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

// liker un post
exports.likePost = (req, res, next) => {
    // Récupération de la sauce avec params.id
    Post.findOne({ _id: req.params.id })
        .then(post => {
            switch (req.body.like) {
                // Cas #1 : si l'utilisateur dislike le post
                case -1:
                    Post.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                        .then(() => res.status(201).json({ message: 'Mince, nous n\'aimez plus ce post' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                    // Cas #2 : si la valeur like ou dislike est différente de 0
                case 0:
                    // Cas #2-A : si le post est déjà liké
                    if (post.usersLiked.find(user => user === req.body.userId)) {
                        Post.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Votre avis a bien été modifié, merci' }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    // Cas #2-B : Si le post est déjà disliké
                    if (post.usersDisliked.find(user => user === req.body.userId)) {
                        Post.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Votre avis a bien été modifié, merci' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                    // Cas #3 : si l'utilisateur like le post
                case 1:
                    Post.updateOne({ _id: req.params.id }, {
                            $inc: { likes: 1 },
                            $push: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                        .then(() => res.status(201).json({ message: 'Super, vous adorez ce post!' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    return res.status(500).json({ messge :'erreur 500' });
            }
        })
        .catch(error => res.status(500).json({ error }))
}