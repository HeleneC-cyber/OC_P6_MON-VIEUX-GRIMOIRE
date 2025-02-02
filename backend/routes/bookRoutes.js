/********************************/
/**** Imports ****/
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const bookController = require('../controllers/bookController')
const multerMiddleware = require('../middlewares/multer-config')
const optimizeImage = require('../middlewares/sharp-config')
const validateBook = require('../middlewares/validateBook')
const ratingController = require('../controllers/ratingController')



/********************************/
/**** Routes ****/
router.get('/', bookController.getBookList)
router.get('/bestrating', ratingController.getBestRatedBooks)
router.get('/:id', bookController.getBook)
router.post('/', auth, multerMiddleware, optimizeImage, validateBook, bookController.createBook) 
router.put('/:id', auth, multerMiddleware, optimizeImage, validateBook, bookController.updateBook)
router.post('/:id/rating', auth, ratingController.addRating)
router.delete('/:id', auth, bookController.deleteBook)



module.exports = router