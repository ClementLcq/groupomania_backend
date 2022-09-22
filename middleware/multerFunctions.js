const multer = require('multer');

// Initilisation des différents formats d'images

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Enregistrement des images dans le storage

const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (res, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        console.log(extension);
        if (extension == undefined) {
            callback(new Error("Invalid MIME TYPES"));
        } else {
            callback(null, name + Date.now() + '.' + extension);
        }
    }

});

module.exports = multer({ storage }).single('image');