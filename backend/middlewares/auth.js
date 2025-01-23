const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') //Décode le token et vérifie sa validité
        const userId = decodedToken.userId //Récupère le userId du token
        //Ajout du userId à la request
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}

module.exports = auth