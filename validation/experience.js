const validator = require('validator')
const isEmpty = require('./is-empty');

const validateExpFunc = (data) => {
    // console.log('came:', data.title)
    let errors = {}

    data.title = !isEmpty(data.title) ? data.title : ''
    data.company = !isEmpty(data.company) ? data.company : ''
    data.from = !isEmpty(data.from) ? data.from : ''
    // console.log(data)
    
    if (validator.isEmpty(data.title)) {
        errors.title = 'Job title is required'
    }

    if (validator.isEmpty(data.company)) {
        errors.company = 'Company is required'
    }

    if (validator.isEmpty(data.from)) {
        errors.from = 'From date is required'
    }


    if (validator)

        return {
            errors,
            isValid: isEmpty(errors)
        }
}
module.exports = validateExpFunc