const Book = require('../models/Book')



// Retrieve the 3 best-rated books
exports.getBestRatedBooks = async (req, res) => {
  try {
    const bestRatedBooks = await Book.find()
      .sort({ averageRating: -1 }) // Sorting in descending order
      .limit(3) // Limit 3 results
    res.status(200).json(bestRatedBooks)
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des meilleurs livres.' })
  }
}


// Adding user ratings
exports.addRating = async (req, res) => {
  try {
    const bookId = req.params.id
    const userId = req.auth.userId
    const { rating } = req.body

    // Test data validation
    if (!userId || !rating || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Données invalides' })
    }

    // Get the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Livre introuvable' })
    }

    // Check if the user has already voted
    const hasVoted = book.ratings.some((rating) => rating.userId === userId) // Return a Boolean value 
    if (hasVoted || book.userId === userId) {
      return res.status(403).json({ error: 'Vous avez déjà noté ce livre' })
    }

    // Add new rating
    const newRating = {
      userId,
      grade: rating,
    }
    book.ratings.push(newRating)

    // Update the average score
    //reduce method : const sumWithInitial = array1.reduce((accumulator, currentValue) => accumulator + currentValue,initialValue)
    const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) 
    const averageRating = totalRatings / book.ratings.length;
    book.averageRating = averageRating
 
    // Save changes
    await book.save()
    return res.status(200).json(book)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}
