const fs = require('fs')


// Middleware pour valider les données du formulaire
const validateBook = (req, res, next) => {
  // Deux cas possibles : requête comporte un fichier ou non
    const bookObject = req.file ? {
      // Si oui alors présence d'un fichier dans la requête
      //Opérateur spread : Copie les champs dans le corps de la requête
      // Parse la chaine de caractère cad transforme l'objet stringifié en Object JavaScript exploitable
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}` //Génère l'url de l'image
    } : { ...req.body } //Sinon, récupère l'objet du corps de la requête

    delete bookObject._id // Supprime le champ id
    delete bookObject._userId // Supprime le champ userId

    // Vérifie que tous les champs du formulaire sont valides
    if (!bookObject.title || !bookObject.author || !bookObject.year || isNaN(bookObject.year) || !bookObject.genre) {
            // Si un des champs invalide et qu'il y a un fichier, supprime le fichier image
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

    next() // Passe au middleware suivant
}



module.exports = validateBook