const Book = require('../models/Book')



// Route pour récupérer les 3 livres les mieux notés
exports.getBestRatedBooks = async (req, res) => { 
    try {
        const bestRatedBooks = await Book.find()
          .sort({ averageRating: -1 }) // Tri décroissant
          .limit(3) // Limite à 3 résultats
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
// exports.addRating = async (req, res) => {
// try {
//   const bookId = req.params.id
//   const { userId, grade } = req.body

//   // Récupérer le livre
//   Book.findOne({ _id: req.params.id }) // Dans la console : est noté comme UNDEFINED
//   console.log(req.params.id )
//   .then(book => {
//     if (book.userId === req.auth.userId || book.ratings.find((rating) => rating.userId === req.auth.userId)) {
//       res.status(403).json({ message: 'Vous avez déjà noté ce livre' })
//     } else {
//       // Ajouter la nouvelle note
//       book.ratings.push(req.body)
      
//       // Sauvegarder les modifications
//       book.save()
//       res.status(200).json({ message: 'Note ajoutée avec succès', book })
//     }
//   })
//   .catch(error => res.status(404).json({ error }))
  

  
//   // Validation des données entrantes
//   if (!userId || !grade || grade < 0 || grade > 5) {
//     return res.status(400).json({ error: 'Données invalides' })
//   }
// }
  
  
// }



// exports.addRating = async (req, res) => {
//   try {
//     const bookId = req.params.id
//     const userId = req.auth.userId
//     const { grade } = req.body
    
//     console.log('ID du livre :', bookId);
//     console.log('Corps de la requête reçu :', req.body);
//     console.log('user :', userId)

//     // // Validation des données entrantes
//     // if (!userId || !grade || grade < 0 || grade > 5) {
//     //   return res.status(400).json({ error: 'Données invalides' })
//     // }

//     // const bookObject = req.file ? {
//     //   ...JSON.parse(req.body.book),
//     //   imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
//     // } : { ...req.body }
    
//     // Récupérer le livre
//     // const book = await Book.findOne(bookId)
//     const book = await Book.findById(bookId);
//     // console.log(book)
//     if (!book) {
//       return res.status(404).json({ error: 'Livre introuvable' })
//     }

//     // // Vérifier que l'utilisateur ne vote pas pour son propre livre
//     // if (book.userId === userId) {
//     //   return res.status(403).json({ error: 'Vous ne pouvez pas noter votre propre livre' });
//     // }

//     // // Vérifier si l'utilisateur a déjà voté
//     // const existingRating = book.ratings.find((rating) => rating.userId === userId)
//     // if (existingRating) {
//     //   return res.status(403).json({ error: 'Vous avez déjà noté ce livre' })
//     // }

//     // Ajouter la nouvelle note
//     const newRating = { userId, grade }
//     book.ratings.push(newRating);

//     // // // Mettre à jour la moyenne des notes
//     // // const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0)
//     // // book.averageRating = totalRatings / book.ratings.length;

//     // // Sauvegarder les modifications
//     // await book.save()
//     //     // const updateRatings = await Book.findByIdAndUpdate(bookId, bookObject, { new: true })
//     //     // return res.status(200).json(updateRatings)

//     // return res.status(200).json({ message: 'Note ajoutée avec succès', book })
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error })
//   }
// }




















// exports.addRating = async (req, res) => {
//   try {
//     const bookId = req.params.id; // Récupérer l'ID du livre depuis les paramètres
//     const userId = req.auth.userId; // Récupérer l'utilisateur connecté depuis le token

//     if (!bookId) {
//       return res.status(400).json({ message: 'ID du livre manquant' }); // Vérifie que l'ID est présent
//     }

//     // Rechercher le livre dans la base de données
//     const book = await Book.findById(bookId);

//     console.log('ID du livre :', id);
//       console.log('Corps de la requête reçu :', req.body);

//     if (!book) {
//       return res.status(404).json({ message: 'Livre non trouvé' }); // Vérifie que le livre existe
//     }

//     if (!Array.isArray(book.ratings)) {
//       return res.status(500).json({ message: 'Structure des données incorrecte : ratings manquant ou invalide' });
//     }

//     // Vérifiez que l'utilisateur n'a pas déjà voté
//     const hasVoted = book.ratings.some((rating) => rating.userId === userId);
//     if (hasVoted) {
//       return res.status(403).json({ message: 'Vous avez déjà voté pour ce livre' });
//     }

//     // Ajouter la note dans le tableau ratings
//     const { grade } = req.body;
//     if (!grade || grade < 0 || grade > 5) {
//       return res.status(400).json({ message: 'Note invalide. La note doit être comprise entre 1 et 5.' });
//     }

//     book.ratings.push({ userId, grade });
//     await book.save();

//     return res.status(201).json({ message: 'Note ajoutée avec succès', book });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Erreur interne du serveur' });
//   }
// };

// exports.addRating = async (req, res, next) => {
//   try {
//       const { rating } = req.body; // Extraire rating du corps
//       const { id } = req.params;  // Extraire l'ID du livre depuis les paramètres d'URL

//       if (!rating || !id) {
//           return res.status(400).json({ message: 'Rating ou ID manquant' });
//       }

//       console.log('ID du livre :', id);
//       console.log('Note :', rating);
//       console.log('Corps de la requête reçu :', req.body);

//       // Ajout de la note dans votre logique métier...
//       res.status(201).json({ message: 'Note ajoutée avec succès' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

