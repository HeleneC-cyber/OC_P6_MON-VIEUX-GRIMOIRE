/********************************/
/**** Imports ****/
const http = require('http') // Import le package http de node
const app = require('./app') // Import de l'application express



// Create a program that waits for http requests

/********************************/
/**** Port ****/ 
// Function that returns a valid port (number or string)
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

const port = normalizePort(process.env.PORT || '4000') // Retrieve port
app.set('port', port) // Set the port to be used for the application




/********************************/
/**** Error handling ****/ 
// Error search and management function
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
/**** Creating a server ****/ 
// createServer method: takes express application as argument (request and response)
const server = http.createServer(app)

server.on('error', errorHandler) // function stored in the server
// event listener registered in server
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind) // Set the port used in the console
})

// Server waits for requests sent from port
server.listen(port)
