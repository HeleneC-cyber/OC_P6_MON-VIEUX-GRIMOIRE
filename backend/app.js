/********************************/
/**** Imports ****/
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const cors = require('cors')
require('dotenv').config()

const booksRouter = require('./routes/bookRoutes')
const usersRouter = require('./routes/userRoutes') 

const { generalLimiter } = require('./middlewares/limiter')



/********************************/
/**** API connection ****/
// connects express application with database (mongoDB)
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express() // calls the express method to create the express application



/********************************/
/**** Middlewares ****/ 

// Secure HTTP headers
app.use(helmet({ 
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [], // tells the browser to automatically convert all HTTP requests to HTTPS
    },
  },
  xssFilter: true, // Protection against XSS attacks 
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Avoid sending too much information in the Referer header
}))
app.disable('x-powered-by') //Already hidden in principle by Helmet (2nd security)


app.use(express.json()) // Or app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true })) 

// Cross-Origin Resource Sharing
app.use( cors({
  origin:'http://localhost:3000',
  allowedHeaders: 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization', //Autorise d'utiliser les en-têtes cités
  methods: ['GET','POST', 'PUT', 'DELETE']
}) )
// Default CORS configuration:
/* {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
} */

app.use('/api', generalLimiter)

app.use('/api/books', booksRouter)
app.use('/api/auth', usersRouter)

app.use('/upload', express.static(path.join(__dirname, 'upload')))



/********************************/
/**** Application export ****/ 
module.exports = app