const Book = require('../models/Book')



// Route pour récupérer les 3 livres les mieux notés
exports.getBestRatedBooks = async (req, res) => { 
    try {
        const bestRatedBooks = await Book.find()
          .sort({ averageRating: -1 }) // Tri décroissant
          .limit(3); // Limite à 3 résultats
        res.status(200).json(bestRatedBooks)
      } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des meilleurs livres.' })
      }
    }
// exports.getBestRatedBooks = (req, res) => {

//         Book.find()
//         .then(bestRatedBooks => {
//             bestRatedBooks.sort({ averageRating: -1 }) // Trie par averageRating décroissant
//             bestRatedBooks.limit(3) // Limite le résultat à 3 livres
//             res.status(200).json(bestRatedBooks)

//         })
//         .catch(res.status(500).json({ error: "Une erreur est survenue lors de la récupération des meilleurs livres." }))
// }






// /!\ /!\ /!\ /!\ id est undefined => à ecrire autrement ! /!\ /!\ !\ /!\
// exports.addRating = (req, res) => {
//   // Récupérer le livre
//   Book.findOne({ _id: req.params.id }) // Dans la console : est noté comme UNDEFINED
//   console.log(req.params.id )
//     .then(book => {
//       if (book.userId === req.auth.userId || book.ratings.find((rating) => rating.userId === req.auth.userId)) {
//         res.status(403).json({ message: 'Vous avez déjà noté ce livre' })
//       } else {
//         // Ajouter la nouvelle note
//         book.ratings.push(req.body)

//         // Sauvegarder les modifications
//         book.save()
//         res.status(200).json({ message: 'Note ajoutée avec succès', book })
//       }
//     })
//     .catch(error => res.status(404).json({ error }))
// }

  // req.params.id
  // const { userId, grade } = req.body

  // // Validation des données entrantes
  // if (!userId || !grade || grade < 0 || grade > 5) {
  //   return res.status(400).json({ error: 'Données invalides' })
  // }

