//Import
const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const bookController = require('../controllers/bookController')
const multerMiddleware = require('../middlewares/multer-config')
const optimizeImage = require('../middlewares/sharp-config')
const validateBook = require('../middlewares/validateBook')
// const handleFile = require('../middlewares/handleFile')
const ratingController = require('../controllers/ratingController')






router.get('/', bookController.getBookList)
router.get('/bestrating', ratingController.getBestRatedBooks)

router.get('/:id', bookController.getBook)
router.post('/', auth, multerMiddleware, optimizeImage, validateBook, bookController.createBook) 
router.put('/:id', auth, multerMiddleware, optimizeImage, validateBook, bookController.updateBook)
router.post('/:id/rating', auth, ratingController.addRating)
router.delete('/:id', auth, bookController.deleteBook)







// router.post('/test', validateBook, (req, res) => {
//     return res.status(200).json({ message: 'Middleware valide.', book: req.validBook })
//   });
//   router.post('/test', multerMiddleware, (req, res) => {
//   console.log("Req body après multer :", req.body)
//   console.log("Req file après multer :", req.file)
//   return res.status(200).json({ message: "MulterMiddleware testé", body: req.body, file: req.file })
// });



module.exports = router