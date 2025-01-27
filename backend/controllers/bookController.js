const Book = require('../models/Book')
const fs = require('fs')



// Création d'un nouveau livre (après vérification des champs par middleware validateBook)
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




// Modification des données d'un livre (après vérification des champs par middleware validateBook)
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id
    const book = await Book.findOne({ _id: bookId })

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' })
    }
    // Vérifie l'autorisation
    if (book.userId != req.auth.userId) {
      if (req.file) {
        fs.unlink(`upload/${req.file.filename}`, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier non autorisé :', err)
        })
      }
      return res.status(403).json({ message: 'Requête non autorisé' })
    }

    //Gestion de nouvelle image envoyée
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
      if (book.imageUrl) {
        const oldImagePath = book.imageUrl.split(`/upload/`)[1] //Extrait le chemin de l'ancienne image
        fs.unlink(`upload/${oldImagePath}`, (err) => { // Supprime l'ancienne image
          if (err) console.error('Erreur lors de la suppression de l\'ancienne image :', err)
        })
      }
      book.imageUrl = imageUrl
    }

    //Mise à jour du livre
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    } : { ...req.body }

    const updateBook = await Book.findByIdAndUpdate(bookId, bookObject, { new: true })
    return res.status(200).json(updateBook)

  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du livre' })
  }
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
    .then(book => {
      // console.log('Infos sur le livre :', book)
      // console.log('Note moyenne', book.averageRating)
      res.status(200).json(book)
    })
    .catch(error => res.status(404).json({ error }))
}




// Récupère tous les livres
exports.getBookList = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}