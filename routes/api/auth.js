const express = require('express')
const router = express.Router();
const { firbase } = require('../../db')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('../../ServiceData/keys')
const passport = require('passport')


// Load User model 
const User = require('../../models/User')

// Load Input Validation
const validationRegisterInput = require('../../validation/register')
const validationLoginInput = require('../../validation/login')


// @route POST api/users/register
// @desc Register users
// @access public
router.post('/registration', (req, res) => {
    const { errors , isValid} = validationRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }
    
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'Email already exists'
            return res.status(400).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default 
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash

                    newUser.save().then(user => res.status(200).json(user))
                    .catch(err => console.log(err));
                })
            })
        }
    }).catch(userError => {
        console.log(userError)
    })
 
})

// @route POST api/users/login
// @desc Login user / Returing JWT Token
// @access public
router.post('/login', (req, res) => {

    const { errors , isValid} = validationLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;
    // console.log(email)
    // Finding the user by email
    User.findOne({ email }).then(user => {
        // console.log(user)
        if (!user) {
            errors.email = 'User not found'
            return res.status(404).json(errors)
        } 

        // Check Password
        bcrypt.compare(password, user.password).then(isMatched => {

            if(isMatched) {
                // User Matched

                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                } // Create JWT payload

                // Signed Token
                jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;

                    res.json({
                        suscess: true,
                        token: 'Bearer ' + token
                    });
                });
            } else {
                errors.password = 'Password incorrect'
                return res.status(400).json(errors);
            }
        })
    }).catch()
})


// @route POST api/users/current
// @desc Return current user
// @access private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})



module.exports = router;