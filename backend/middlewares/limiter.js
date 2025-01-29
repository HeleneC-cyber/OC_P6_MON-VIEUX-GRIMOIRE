const rateLimit = require('express-rate-limit')




// Limite le nombre de requête à l'application (mais pas au serveur, serveur reçoit les requêtes)

const signUpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, //Limite le nombre de requête à 3 (p/r à IP)
    message : "Trop de requêtes envoyées, veuillez réessayer plus tard",
    standardHeaders: false,
    legacyHeaders: false
})



const loginAccountLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3,
    message : "Trop de tentatives de connexion, veuillez réessayer plus tard",
    standardHeaders: false,
    legacyHeaders: false
})



const generalLimiter = rateLimit({
    windowMs: 1000, // 1s
    max: 5,
    message : "Trop de requêtes envoyées, veuillez patienter",
    standardHeaders: false,
    legacyHeaders: false
})

module.exports = { signUpLimiter, loginAccountLimiter, generalLimiter}