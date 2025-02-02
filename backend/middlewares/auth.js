const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') // Decode the token and check its validity
        const userId = decodedToken.userId // Retrieve the token's userId
        // Add userId to request
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error : 'identifiant ou mot de passe incorrecte' })
    }
}

module.exports = auth