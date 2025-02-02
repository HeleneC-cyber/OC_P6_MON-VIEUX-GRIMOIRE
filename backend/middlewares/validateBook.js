const fs = require('fs')



// Middleware to validate form data
const validateBook = (req, res, next) => {
  //  Two possible cases: request includes a file or not
    const bookObject = req.file ? {
      // If a file is present
      ...JSON.parse(req.body.book),// Parse the string (transforms the stringified object into a usable JavaScript Object)
      imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}` // Generate image url
    } : { ...req.body } // Otherwise, retrieve the request body object

    delete bookObject._id // Delete id field
    delete bookObject._userId // Delete userId field

    // Check that all form fields are valid
    if (!bookObject.title || !bookObject.author || !bookObject.year || isNaN(bookObject.year) || !bookObject.genre) {
            // If one of the fields is invalid and there is a file, delete the image file.
      if (req.file) {
        fs.unlink(req.file.path, (error) => {
          if (error) {
            console.error('Erreur lors de la suppression de l\'image d\'origine :', error)
          } else {
            console.log('Image supprimée.')
          }
        })
      }
      return res.status(400).json({ error: 'Tous les champs requis doivent être fournis dans le bon format.' })
    }

    next() // Go to next middleware
}



module.exports = validateBook