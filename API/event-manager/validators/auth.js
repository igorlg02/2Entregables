const Joi = require('joi');

const authValidator = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .error(
            new Error('email should be a standard email')
        ),

        password: Joi.string()
        .required()
        .error(
            new Error('password is required')
        ),
    repeatPassword: Joi.string()
        .equal(Joi.ref('password'))
        .required()
        .error(
            new Error('password does not match')
        )

})

module.exports = {
    authValidator
}
