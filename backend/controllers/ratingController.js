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



exports.addRating = async (req, res) => {
  try {
    const bookId = req.params.id
    const userId = req.auth.userId
    const { rating } = req.body

    // console.log('ID du livre :', bookId)
    // console.log('Note :', rating)
    console.log('Corps de la requête reçu :', req.body)

    // Teste la Validation des données
    if (!userId || !rating || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Données invalides' })
    }

    // Récupére le livre
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Livre introuvable' })
    }

    // Vérifie si l'utilisateur a déjà voté
    const hasVoted = book.ratings.some((rating) => rating.userId === userId) //Retourne une valeur booléenne 
    if (hasVoted || book.userId === userId) res.status(403).json({ error: 'Vous avez déjà noté ce livre' })

    // Ajoute la nouvelle note
    const newRating = {
      userId,
      grade: rating,
    }
    book.ratings.push(newRating)
    console.log(book)

    // Met à jour la moyenne des notes
    //Méthode reduce() : const sumWithInitial = array1.reduce((accumulator, currentValue) => accumulator + currentValue,initialValue)
    const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) 
    const averageRating = totalRatings / book.ratings.length;
    book.averageRating = averageRating
 
    // Sauvegarder les modifications
    await book.save()
    return res.status(200).json(book)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}




















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

