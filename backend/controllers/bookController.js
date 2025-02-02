const Book = require('../models/Book')
const fs = require('fs')



// Creating a new book
exports.createBook = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'Vous devez ajouter une image.' })
    }

    const bookObject = JSON.parse(req.body.book)

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}` // Generates image url
    })

    await book.save()
    return res.status(201).json({ message: 'Livre enregistré !' })
    
  } catch (error) {
    return res.status(400).json({ error })
  }
}



// Editing book data
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id
    const book = await Book.findOne({ _id: bookId })

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' })
    }
    // Check authorization
    if (book.userId != req.auth.userId) {
      if (req.file) {
        fs.unlink(`upload/${req.file.filename}`, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier non autorisé :', err)
        })
      }
      return res.status(403).json({ message: 'Requête non autorisé' })
    }

    // Manage new image sent
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
      if (book.imageUrl) {
        const oldImagePath = book.imageUrl.split(`/upload/`)[1] // path extraction from old image
        fs.unlink(`upload/${oldImagePath}`, (err) => { // Delete old image
          if (err) console.error('Erreur lors de la suppression de l\'ancienne image :', err)
        })
      }
      book.imageUrl = imageUrl
    }

    // Book update
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



// Deleting a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id })
    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Non autorisé' })
    }
    const filename = book.imageUrl.split('/upload/')[1] // Retrieve file name
    fs.unlink(`upload/${filename}`, () => { // fs unlink method (for interacting with the file system)
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(401).json({ error }))
    })

  } catch (error) {
    return res.status(500).json({ error })
  }
}



// Recovering the selected book (from id)
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id })
    return res.status(200).json(book)
  } catch (error) {
    return res.status(404).json({ error })
  }
}



// Recovering all books
exports.getBookList = async (req, res) => {
  try {
    const books = await Book.find()
    return res.status(200).json(books)
  } catch (error) {
    return res.status(400).json({ error })
  }
}