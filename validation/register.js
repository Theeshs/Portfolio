const validator = require('validator')
const  isEmpty = require('./is-empty');

const validateFunc = (data) => {
   let errors = {}

   data.name = !isEmpty(data.name) ? data.name: ''
   data.email = !isEmpty(data.email) ? data.email: ''
   data.password = !isEmpty(data.password) ? data.password: ''
   data.password2 = !isEmpty(data.password2) ? data.password2: ''

   if(!validator.isLength(data.name, { min: 2, max: 30 })) {
       errors.name = "Name must be between 2 and 30 characters"
   }

   if(validator.isEmpty(data.name)) {
       errors.name = 'Name field is empty'
   }

   if(validator.isEmpty(data.email)) {
    errors.email = 'Email field is empty'
    }

    if(!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    if(validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    } 

    if(!validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters'
    }

    if(validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is requirfed'
    }

    if(!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Password not matched'
    }


    

   if(validator)

   return {
       errors,
       isValid: isEmpty(errors)
   }
}
module.exports = validateFunc