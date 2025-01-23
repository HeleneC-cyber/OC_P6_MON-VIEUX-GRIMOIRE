// Import de mongoose
const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')

// Création d'un schéma de données pour l'ajout d'un utilisateur
const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, //une seule inscription possible par email
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //Validation du format de l'email
    }, 
    password: { type: String, required: true }, //, minlength: 8
})

// userSchema.plugin(uniqueValidator) // Renforce l'unicité et améliore message erreur lors de l'inscription


// Export du modèle User
module.exports = mongoose.model('User', userSchema)