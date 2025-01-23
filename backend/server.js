// Création d'un programme qui attend des requêtes http

// Import le package http de node
const http = require('http')

// Import de l'application express
const app = require('./app')


// Fonction qui revoie un port valide (que ça soit un nombre ou un string)
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}

const port = normalizePort(process.env.PORT || '4000') // Récupère le port
app.set('port', port) // Donne le port à utiliser pour l'application

// Fonction qui recherche et gère les erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
        default:
            throw error
    }
}

// Création d'un serveur via la méthode createServeur qui prend en argument l'application express (=fonction qui prend en compte requête et réponse)
const server = http.createServer(app)

server.on('error', errorHandler) // fonction enregistrée dans le serveur
// écouteur d'événement enregistré dans le serveur
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind) //Consigne le port utilisé dans la console
})


// Serveur attend les requêtes envoyées depuis le port
server.listen(port)
