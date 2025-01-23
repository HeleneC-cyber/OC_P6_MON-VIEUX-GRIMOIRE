const fs = require('fs')
const path = require('path')


const deleteFile = (filePath) => {
    fs.unlink(filePath, (error) => {
      if (error) console.error("Erreur lors de la suppression du fichier :", error);
    })
  }



// const handleFile = async (req, res, next) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'Aucun fichier reçu.' });
//     }

//     try {
//         // Récupération de l'extension d'origine
//         const originalExtension = path.extname(req.file.originalname);
//         const originalPath = `upload/${req.file.filename.split('_')[0]}${originalExtension}`;
//         console.log('Chemin fichier original avec extension d\'origine :', originalPath);

//         // Supprime l'image originale après optimisation
//         setTimeout(() => {
//             fs.unlink(originalPath, (err) => {
//                 if (err) {
//                     console.error('Erreur lors de la suppression de l\'image d\'origine :', err);
//                 } else {
//                     console.log('Image originale supprimée :', originalPath);
//                 }
//             });
//         }, 500);

//         next(); // Passe au contrôleur suivant
//     } catch (err) {
//         console.error('Erreur dans le middleware de gestion des fichiers :', err);
//         res.status(500).json({ message: 'Erreur serveur.' });
//     }
// };

// module.exports = handleFile

// /**
//  * Supprime un fichier en utilisant son chemin.
//  * @param {string} filePath - Chemin du fichier à supprimer.
//  * @returns {Promise<void>} - Résout la promesse si le fichier est supprimé.
//  */
// const deleteFile = (filePath) => {
//     return new Promise((resolve, reject) => {
//         fs.unlink(filePath, (error) => {
//             if (error) {
//                 console.error(`Erreur lors de la suppression du fichier : ${filePath}`, error);
//                 return reject(error);
//             }
//             console.log(`Fichier supprimé : ${filePath}`);
//             resolve();
//         });
//     });
// };

module.exports = { deleteFile }