const validator = require('validator')
const isEmpty = require('./is-empty');

const validateFunc = (data) => {
    let errors = {}

    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''

    
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is requred'
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }



    if (validator)

        return {
            errors,
            isValid: isEmpty(errors)
        }
}
module.exports = validateFunc