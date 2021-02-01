require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')

const {
    login,
    register,
    random
} = require('./event-manager/controllers/authentication')

// Middlewares
const { isAuthenticated } = require('./event-manager/middelwares/auth')

const {
    hasAPIKey
} = require('./event-manager/middelwares/auth')

const app = express()

/**
 * Los siguientes middlewares son necesarios para 
 * acceder fácilmente a los campos pasados en las peticiones POST/PUT
 * donde la información viene en el body
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const DEFAULT_PORT = 3333

const currentPort = process.env.PORT || DEFAULT_PORT

/**
 * Crear un nuevo usuario
 */
app.post('/user', hasAPIKey, register)


/**
 * Autenticar usuario
 */
app.post('/user/login', hasAPIKey, login)


app.get('/got', isAuthenticated, random)


console.log(`Running on port ${currentPort}`)
app.listen(currentPort)

// 404 handler
app.use( (req, res, next) => res.status(404).send('404 Not found'))
