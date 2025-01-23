// Import
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


// Configuration pour optimiser les images :
const optimizeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            next()
        } else {

            // Chemin du fichier original
            const inputPath = req.file.path

            // Nouveau chemin pour le fichier optimisé
            const fileNameWithoutExt = path.basename(req.file.originalname, path.extname(req.file.originalname)) //Fichier sans l'extension
            const outputPath = path.join('upload', `${fileNameWithoutExt}_${Date.now()}.webp`)
            // console.log('Chemin fichier transformé (path) :', req.file.path)
            // console.log('Nom original du fichier (originalname) :', req.file.originalname)


            const sharpInstance = sharp(await fs.promises.readFile(inputPath))
                .resize(500) // Redimensionne à une largeur de 500px (hauteur calculée automatiquement)
                .webp({ quality: 80 }) // Convertit en webp avec qualité 80%

            await sharpInstance.toFile(outputPath) // Enregistre l'image optimisée
            await fs.promises.unlink(inputPath, (error) => {
                if (error) {
                    console.error('Erreur lors de la suppression de l\'image d\'origine :', error)
                } else {
                    console.log('Image originale supprimée.')
                }
            })

            // Optimisation avec Sharp
            // await sharp(inputPath)
            //     .resize(500) // Redimensionne à une largeur de 500px (hauteur calculée automatiquement)
            //     .webp({ quality: 80 }) // Convertit en webp avec qualité 80%
            //     .toFile(outputPath) // Enregistre l'image optimisée
            // console.log('Image optimisée enregistrée.')

            // fs.unlink(inputPath, (error) => {
            //     if (error) {
            //         console.error('Erreur lors de la suppression de l\'image d\'origine :', error)
            //     } else {
            //         console.log('Image originale supprimée.')
            //     }
            // })



            // MAJ du chemin, vers fichier optimisé
            req.file.path = outputPath;
            req.file.destination = 'upload';
            req.file.filename = path.basename(outputPath);

            next() // Passe au middleware suivant
        }
    } catch (error) {
        console.error('Erreur lors de l\'optimisation de l\'image :', error)
        fs.unlink(req.file.path, () => {})
        res.status(500).json({ error })
    }
}

module.exports = optimizeImage