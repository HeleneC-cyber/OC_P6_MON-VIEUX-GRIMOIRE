// Import de mongoose
const mongoose = require('mongoose')

// méthode Schema : Création d'un schéma de données pour un livre, pour la base de données MongoDB 
// Remarque :id généré automatiquement par mongoose
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String, required: true },
        grade: { 
            type: Number, 
            required: true, 
            min: 0,
            max: 5
        },
    }],
    averageRating: { type: Number, required: true },
})

// Export du modèle Book et le rend utilisable à l'aide de la méthode model
module.exports = mongoose.model('Book', bookSchema)