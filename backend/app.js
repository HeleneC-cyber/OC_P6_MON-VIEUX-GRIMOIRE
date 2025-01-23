// imports
const express = require('express') //méthode express
const mongoose = require('mongoose') //mongoose
const bodyParser = require('body-parser')
require('dotenv').config()

const booksRouter = require('./routes/bookRoutes') //Routeur pour les livres
const usersRouter = require('./routes/userRoutes') //Routeur pour les utilisateurs

const path = require('path')




// connecte API (application express) avec la base de données (mongoDB)
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))


// constante app appelle la méthode express pour créer l'application express
const app = express()





// Middleware : Intercepte les requêtes ayant un contenu json et permet d'accéder à ce contenu dans req.body (rend les données du corps de la requête exploitables)

// app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true })) 


app.use((req, res, next) => {
  // console.log('Requête reçue !', req.body)
  // Ajout d'en-têtes à l'objet réponse renvoyé au navigateur pour autoriser l'accès
  res.setHeader('Access-Control-Allow-Origin', '*') //Tout le monde a le droit d'accéder à l'API (pour l'instant)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization') //Autorisation d'utiliser les en-têtes cités
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') //Accès à certaines requêtes
  next() // next appelé, permet de renvoyer à la prochaine fonction
})

// // 3. Ajout d'un middleware de debug temporaire
// app.use((req, res, next) => {
//   console.log('Headers:', req.headers)
//   console.log('Body:', req.body)
//   console.log('Method:', req.method)
//   next()
// })

app.use('/api/books', booksRouter)
app.use('/api/auth', usersRouter)


app.use('/upload', express.static(path.join(__dirname, 'upload')))


// app.use((req, res, next) => {
//     console.log('réponse envoyée avec succès !')
// })



// Export de l'application pour y accéder depuis les autres fichiers (serveur node)
module.exports = app