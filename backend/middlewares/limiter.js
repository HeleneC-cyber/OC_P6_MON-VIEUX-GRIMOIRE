const rateLimit = require('express-rate-limit')



// Limits the number of requests to the application (but not to the server, server receives requests)

const signUpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 3, // Limits the number of requests to 3 (in relation to IP)
    message : "Trop de requêtes envoyées, veuillez réessayer plus tard",
    standardHeaders: false,
    legacyHeaders: false
})



const loginAccountLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 mins
    max: 3,
    message : "Trop de tentatives de connexion, veuillez réessayer plus tard",
    standardHeaders: false,
    legacyHeaders: false
})



const generalLimiter = rateLimit({
    windowMs: 1000, // 1s
    max: 10,
    message : "Trop de requêtes envoyées, veuillez patienter",
    standardHeaders: false,
    legacyHeaders: false
})



module.exports = { signUpLimiter, loginAccountLimiter, generalLimiter}