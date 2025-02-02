// Import
const multer = require('multer')



const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
    'image/webp':'webp',
}

// Configuration for image recording :
const storage = multer.diskStorage({
    // Function indicating registration file
destination: (req, file, callback) => {
    callback(null, 'upload') // 2 arguments: null to indicate that there is no error & the name of the folder
},
// Function defining file name (to have a unique name for each image)
filename: (req, file, callback) => {
    const name = file.originalname.replace(/\.[^/.]+$/, '_').replaceAll(' ', '_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
}
})



// Export multer middleware (specifying that it is a single image file)
const multerMiddleware = multer({ storage }).single('image')
module.exports = multerMiddleware
