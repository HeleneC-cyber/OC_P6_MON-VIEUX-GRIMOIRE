/********************************/
/**** Imports ****/
const http = require('http') // Import le package http de node
const app = require('./app') // Import de l'application express



//Création d'un programme qui attend des requêtes http

/********************************/
/**** Port ****/ 
// Fonction qui revoie un port valide (nombre ou string)
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




/********************************/
/**** Gestion de l'erreur ****/ 
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



/********************************/
/**** Création d'un serveur ****/ 
// méthode createServeur : prend en argument l'application express (=prend en compte requête et réponse)
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
