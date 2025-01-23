const Book = require('../models/Book')
const fs = require('fs')



// Création d'un nouveau livre
// exports.createBook = (req, res, next) => {
//   try {

//     if (!req.body.book) {
//       return res.status(400).json({ error: 'Le champ book est requis.' })
//     }

//     const bookObject = JSON.parse(req.body.book) // Analyse l'objet
//     //Mesures de sécurité :
//     delete bookObject._id // Supprime le champ id
//     delete bookObject._userId // Supprime le champ userId

//     // Vérifie que tous les champs obligatoires sont valides
//     if (!bookObject.title || !bookObject.author || !bookObject.year || isNaN(bookObject.year) || !bookObject.genre) {
//       // Si ce n'est pas le cas, supprime le fichier image
//       fs.unlink(req.file.path, (error) => {
//                 if (error) {
//                     console.error('Erreur lors de la suppression de l\'image d\'origine :', error)
//                 } else {
//                     console.log('Image supprimée.')
//                 }
//             })
//       return res.status(400).json({ error: 'Tous les champs requis doivent être fournis.' })
//     }
//     if (!req.file) {
//       return res.status(400).json({ error: 'Vous devez ajouter une image.' })
//     } 

//     const book = new Book({
//       ...bookObject,
//       userId: req.auth.userId,
//       imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}` //Génère l'url de l'image
//     })
//     book.save()
//       .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
//       .catch(error => res.status(400).json({ error }))
//   } catch (error) {
//     console.error("Erreur Mongoose :", error)
//     res.status(400).json({ error: "Requête invalide" })
//   }
// }

// Création d'un nouveau livre après vérification des champs par middleware validateBook
exports.createBook = (req, res, next) => {

    if (!req.file) {
      return res.status(400).json({ error: 'Vous devez ajouter une image.' })
    }

    const bookObject = JSON.parse(req.body.book)

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}` //Génère l'url de l'image
    })
    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
      .catch(error => res.status(400).json({ error }))

}




// Modification des données d'un livre
exports.updateBook = (req, res) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
  } : { ...req.body }

  // Récupére le livre existant
  Book.findOne({ _id: req.params.id })
    .then((book) => {

      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' })
      }

      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisé' }) // => Si c'est le cas, fait crash l'app...

      } else {

        // Si une nouvelle image est envoyée
        if (req.file) {
          const oldImagePath = book.imageUrl.split(`${req.get('host')}/`)[1] //Extrait le chemin de l'ancienne image
          fs.unlink(oldImagePath, (err) => { // Supprime l'ancienne image
            if (err) {
              console.error("Erreur lors de la suppression de l'ancienne image :", err)
            } else {
              console.log("Ancienne image supprimée avec succès.")
            }
          })
        }

        // Mise à jour des données du livre
        return Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
      }
    })
    .then(() => res.status(200).json({ message: 'Livre modifié' }))
    .catch((error) => {
      console.error('Erreur lors de la mise à jour du livre :', error)
      res.status(400).json({ error })
    })

}




// Suppresion d'un livre
exports.deleteBook = (req, res) => {

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        const filename = book.imageUrl.split('/upload/')[1] //Récupère le nom du fichier
        fs.unlink(`upload/${filename}`, () => { // Méthode unlink de fs (permettant d'intéragir avec le système de fichiers)
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch(error => res.status(500).json({ error }))
}




// Récupère le livre sélectionné via l'id
exports.getBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
}




// Récupère tous les livres
exports.getBookList = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}