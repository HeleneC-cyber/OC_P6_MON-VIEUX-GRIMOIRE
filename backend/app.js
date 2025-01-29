/********************************/
/**** Imports ****/
const express = require('express') //méthode express
const mongoose = require('mongoose') //mongoose
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const cors = require('cors')
require('dotenv').config()

const booksRouter = require('./routes/bookRoutes') //Routeur pour les livres
const usersRouter = require('./routes/userRoutes') //Routeur pour les utilisateurs

const { generalLimiter } = require('./middlewares/limiter')



/********************************/
/**** Connexion à l'API ****/
// connecte application express avec la base de données (mongoDB)
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express() // appelle la méthode express pour créer l'application express



/********************************/
/**** Middlewares ****/ 
// Intercepte les requêtes ayant un contenu json et permet d'accéder à ce contenu dans req.body (rend les données du corps de la requête exploitables)

// Sécurise les en-tête HTTP
app.use(helmet({ 
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000"], // Ajoute ton domaine si nécessaire
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [], //indique au navigateur de convertir automatiquement toutes les requêtes HTTP en HTTPS
    },
  },
  xssFilter: true, // Protection contre les attaques XSS 
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Evite d'envoyer trop d'infos dans l'en-tête Referer
}))
app.disable('x-powered-by') //Deja caché en principe par Helmet, 2e sécurité


app.use(express.json()) // OU app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true })) 

app.use( cors({
  origin:'http://localhost:3000',
  allowedHeaders: 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization', //Autorise d'utiliser les en-têtes cités
  methods: ['GET','POST', 'PUT', 'DELETE']
}) )
// Configuration par défaut des cors :
/* {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
} */

// app.use((req, res, next) => {
//   // Ajout d'en-têtes à l'objet réponse renvoyé au navigateur pour autoriser l'accès
//   res.setHeader('Access-Control-Allow-Origin', '*') //Tout le monde a le droit d'accéder à l'API (pour l'instant)
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization') //Autorisation d'utiliser les en-têtes cités
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') //Accès à certaines requêtes
//   next() // next appelé, permet de renvoyer à la prochaine fonction
// })

app.use('/api', generalLimiter)

app.use('/api/books', booksRouter)
app.use('/api/auth', usersRouter)

app.use('/upload', express.static(path.join(__dirname, 'upload')))



/********************************/
/**** Export de l'application ****/ 
module.exports = app