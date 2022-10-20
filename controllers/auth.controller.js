const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const emailValidator = require('email-validator');

// Utilisation dotenv
const dotenv = require('dotenv');
dotenv.config();
const TOKEN_SECRET = process.env.MONGOLAB_TOKEN;
const EXP_TOKEN = process.env.MONGOLAB_EXP_TOKEN;

exports.signup = (req, res, next) => {
    // Mise en place d'une condition pour vérifier la validité de l'adresse mail
    // + salage / hash du mot de passe
    if (emailValidator.validate(req.body.email)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                    .catch(error => res.status(400).json({ error }));
            })
    } else {
        res.status(200).json({ errors});
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'La paire identifiant / mot de passe est incorrecte' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'La paire identifiant / mot de passe est incorrecte' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                userEmail : user.email,
                                isAdmin: user.isAdmin,
                                token: jwt.sign({ userId: user._id, isAdmin : user.isAdmin },
                                    TOKEN_SECRET, { expiresIn: EXP_TOKEN }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

