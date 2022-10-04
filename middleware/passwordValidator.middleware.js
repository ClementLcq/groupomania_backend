const mongoose = require('mongoose');

const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator;

// Création du schéma de mot de passe

passwordSchema
    .is()
    .min(8) // 8 carac mini
    .is()
    .max(22) // 16 carac max
    .has()
    .uppercase() // au moins une majuscule
    .has()
    .lowercase() // au moins une minuscule
    .has()
    .digits(1) // 1 chiffres mini
    .has()
    .not()
    .spaces() // Pas d'espace
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist de mdp

//Analyse du schema et validation du mot de passe

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return (
            res.writeHead(
                400,
                "Votre mot de passe doit contenir entre 8 et 16 caractères et 2 chiffres, au moins une minuscule et une majuscule"
            ),
            res.end(
                "Votre mot de passe doit contenir entre 8 et 16 caractères et 2 chiffres, au moins une minuscule et une majuscule"
            )
        );
    }
};