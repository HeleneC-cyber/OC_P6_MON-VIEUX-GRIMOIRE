// Import
const multer = require('multer')

const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
    'image/webp':'webp',

}

// Configuration pour l'enregistrement des images :
const storage = multer.diskStorage({
    // Fonction indiquant le dossier d'enregistrement
destination: (req, file, callback) => {
    callback(null, 'upload') //2 arguments : null permet de dire qu'il n'y a pas d'erreur et le nom du dossier
},
// Fonction définissant le nom du fichier (afin d'avoir un nom unique pour chaque image)
filename: (req, file, callback) => {
    const name = file.originalname.replace(/\.[^/.]+$/, '_').replaceAll(' ', '_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
}
})

// // Filtre pour valider la requête avant d'enregistrer l'image
// const fileFilter = (req, file, callback) => {
//     // Vérifie que tous les champs nécessaires sont présents
//     if (!req.body.title) {
//       return callback(new Error('Requête invalide : un champ requis est manquant'), false) // Rejette le fichier
//     }
//       // Vérifie le type MIME du fichier
//   if (!MIME_TYPES[file.mimetype]) {
//     return callback(new Error('Format de fichier non pris en charge'), false) // Rejette le fichier
//   }
//   // Si tout est valide
//   callback(null, true)
// }


// Export du middleware multer (en précisant qu'il s'agit d'un fichier image unique)
// module.exports = multer({storage}).single('image')

const multerMiddleware = multer({ storage }).single('image') // , fileFilter

module.exports = multerMiddleware
