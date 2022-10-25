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

// Modifier un post

exports.modifyPost = async (req, res) => {
    const { description } = req.body;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : "";
    // On regarde si il y a un fichier dans le post
    const postObject = {
      description,
      imageUrl: imageUrl,
    };
  
    delete req.body.user_id;
    if (req.file !== undefined) {
      
      Post.findOne({ _id: req.params.id })
        .then((post) => {
          //On supprime l'image du post
          const filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            //et on met à jour la DB avec une nouvelle image
            Post.updateOne(
              { _id: req.params.id },
              { ...postObject, _id: req.params.id }
            )
              .then(() => res.status(200).json("Post mis à jour !"))
              .catch((error) => res.status(401).json({ error }));
          });
        })
        .catch((error) => res.status(404).json({ error }));
    } else {
      //Si pas d'image dans le post
      Post.updateOne({ _id: req.params.id }, { description : description })
        .then(() => res.status(200).json("Post mis à jour !"))
        .catch((error) => res.status(401).json({ error }));
    }
  };


// Supprimer un post

exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (post == null) {
                res.status(404).json({ message: "Le post n'existe pas" });
            } else if (post.imageUrl === null) { 
                Post.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                .catch(error => res.status(400).json({ error }));
            } else if ((post.userId == req.auth.userId) || req.auth.isAdmin ) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                });
            } else {
                res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer le post" });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// liker un post

exports.likePost = async (req, res) => {
    //Get the post with params
    const post = await Post.findById(req.params.id);
    
      //Check if user allready like the post, if not, insert userId in likes array
      //else pull-it from likes array
      if (!post.usersLiked.includes(req.auth.userId)) {
        await post.updateOne({ $push: { usersLiked: req.auth.userId } });
        const postUpdated = await Post.findById(req.params.id);
        res.status(200).json(postUpdated);
      } else {
        await post.updateOne({ $pull: { usersLiked: req.auth.userId } });
        const postUpdated = await Post.findById(req.params.id);
        res.status(200).json(postUpdated);
      }
    
  };
