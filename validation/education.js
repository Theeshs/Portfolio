const validator = require('validator')
const isEmpty = require('./is-empty');

const validateEducation = (data) => {
    // console.log('came:', data.title)
    let errors = {}

    data.school = !isEmpty(data.school) ? data.school : ''
    data.degree = !isEmpty(data.degree) ? data.degree : ''
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ''
    data.from = !isEmpty(data.from) ? data.from : ''
    // console.log(data)
    
    if (validator.isEmpty(data.school)) {
        errors.school = 'School filed is required'
    }

    if (validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required'
    }

    if (validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Filed of study is required'
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
module.exports = validateEducation