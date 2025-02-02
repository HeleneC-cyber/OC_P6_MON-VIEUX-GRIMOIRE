// Import
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


// Configuration for image optimization :
const optimizeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            next()
        } else {

            //  Original file path
            const inputPath = req.file.path

            // New path for optimized file
            const fileNameWithoutExt = path.basename(req.file.originalname, path.extname(req.file.originalname)) // File without extension
            const outputPath = path.join('upload', `${fileNameWithoutExt}_${Date.now()}.webp`)
       
            // Optimization with Sharp
            const sharpInstance = sharp(await fs.promises.readFile(inputPath))
                .resize(500) // Resize to 500px width (automatically calculated height)
                .webp({ quality: 80 }) // Convert to webp with 80% quality

            await sharpInstance.toFile(outputPath) // Saves optimized image
            await fs.promises.unlink(inputPath, (error) => {
                if (error) {
                    console.error('Erreur lors de la suppression de l\'image d\'origine :', error)
                } else {
                    console.log('Image originale supprimée.')
                }
            })

            // Update path to optimized file
            req.file.path = outputPath;
            req.file.destination = 'upload';
            req.file.filename = path.basename(outputPath);

            next() // Go to next middleware
        }
    } catch (error) {
        console.error('Erreur lors de l\'optimisation de l\'image :', error)
        fs.unlink(req.file.path, () => {})
        res.status(500).json({ error })
    }
}



module.exports = optimizeImage