const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db/mysql')

const { authValidator } = require('../validators/auth')

const register = async (req, res) => {
    // comprobar que nos pasan los campos requeridos
    // (como mínimo serán email y password pero pueder ser
    // cualquiera que haga falta en vuestro proyecto)

    // almacenaremos el usuario en BBDD
    // con la password encriptada (con bcrypt)
    // para que nunca se sepa cuál era la password original
    
    try {
        console.log(req.body)
        await authValidator.validateAsync(req.body)
                        
        // En una aplicación más grande, se podría incluir
        // más información del usuario (nombre real, dirección
        // postal, etc)
        const { email, password, repeatPassword } = req.body

        const passwordBcrypt = await bcrypt.hash(password, 10);

        // Comprobamos aquí si ya existe un usuario con ese
        // email y que no esté validado (activo), ya que si existe y se 
        // encuentra sin validar debe permitir el registro 

        const user = await db.getUser(email)
        console.log(user)

        if (user && user.active) {
            res.status(401).send()
            return
        }

        let preCreated = false

        if (user && !user.active) {
            preCreated = true
        }        

        await db.register(email, passwordBcrypt, preCreated)
        
        // Enviar un correo eléctronico: si el usuario
        // de verdad es quien dice ser, podrá acceder a dicho correo
        // utils.sendConfirmationMail(email, `http://${process.env.PUBLIC_DOMAIN}/user/validate/${validationCode}`)

    } catch (e) {
        res.status(400).send('Error registration user')
        console.log('Error registration user', e.message)
        return
    }

    res.send('Welcome!')
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = db.getUser(email)
 
        const passwordIsvalid = await bcrypt.compare(password, user.password);

        if (!passwordIsvalid) {
            res.status(401).send('Incorrect password or user')
            return
        }

        const tokenPayload = {
            email: user.email,
            password: user.password,
        }

        const token = jwt.sign(tokenPayload, process.env.SECRET, {
            expiresIn: '1d'
        });


        res.json({
            token
        })


    } catch (e) {
        res.status(401).send('Some error ocurred')
        console.log(e.message)
        return
    }
}

const random = async (req, res) => {
    res.send('Has llegado hasta aquí')
}

module.exports = { random }

module.exports = {
    login,
    register,
    random
}