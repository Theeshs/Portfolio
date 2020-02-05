const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// Load Validations
const validateProfileInput = require('../../validation/profile')
const validateExpInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')


// @route GET api/profile/myprofile
// @desc Get Current User Data 
// @access Private
router.get('/myprofile', passport.authenticate('jwt', {session: false}),(req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user'
            return res.status(404).json(errors);
        }

        res.json(profile)
    }).catch(err => res.status(404).json(err))
})

// @route POST api/profile/myprofile
// @desc Get Create or Edit User Data 
// @access Private
router.post('/myprofile', passport.authenticate('jwt', {session: false}),(req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)

    // Check Valid
    if (!isValid) {
        return res.status(400).json(errors)
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if(req.body.handle) profileFields.handle = req.body.handle
    if(req.body.company) profileFields.company = req.body.company
    if(req.body.website) profileFields.website = req.body.website
    if(req.body.location) profileFields.location = req.body.location
    if(req.body.bio) profileFields.bio = req.body.bio
    if(req.body.status) profileFields.status = req.body.status
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername

    // Skills - Split into array

    if (typeof req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(',')
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if(req.body.instergram) profileFields.social.instergram = req.body.instergram

    Profile.findOne({ user: req.user.id })
    .then(profile => {
        if(profile) {
            Profile.findOneAndUpdate({user: req.user.id}, { $set: profileFields }, {new: true})
            .then(profile => res.json(profile)).catch(err => res.json(err))
        } else {

            // Create

            // Check if handle exists
            Profile.findOne({handle: profileFields.handle}).then(profile => {
                if (profile) {
                    errors.handle = "That handle already exist"
                }

                // Save Profile
                new Profile(profileFields).save().then(profile => res.json(profile))
            }).catch(error => res.json(err))
        }
    })
    

})

// @route GET api/profile/handle/:handle
// @desc Get Profile by handle
// @access public
router.get('/handle/:handle', (req, res) => {
    const errors = {}
    Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name',  'avatar'])
    .then(profile => {
        if(!profile) {
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors)
        }

        res.json(profile)
    }).catch(err => res.status(404).json(err))
});

// @route GET api/profile/all
// @desc Get all Profile
// @access public
router.get("/all", (req, res) => {
    const errors = {}
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if (!profiles) {
            errors.noprofile = 'There are no profiles'
            return res.status(404).json(errors)
        }
        res.json(profiles)
    }).catch(err => res.status(404).json(err))
})

// @route GET api/profile/user/:user_id
// @desc Get Profile by user_id
// @access public
router.get('/user/:user_id', (req, res) => {
    // console.log(req)
    const errors = {}
    // console.log(req.params.user_id)
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile) {
            errors.noprofile = "There is no profile for this User"
            res.status(404).json(errors);
        }
        res.json(profile)
    }).catch(err => res.status(404).json(err));
})

// @route POST api/profile/experiance
// @desc Add Experiance to the profile
// @access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateExpInput(req.body)

    // Check Valid
    if (!isValid) {
        console.log('sda')
        return res.status(400).json(errors)
    }

    console.log('No error')

    Profile.findOne({ user: req.user.id })
    .then(profile => {
        // console.log(profile)
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from : req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        console.log(newExp)
        // Add to expericne array
        profile.experience.unshift(newExp)
        console.log('unshifted')
        // console.log(profile)
        profile.save().then(profile => res.json(profile)).catch(er => res.json(er))
    }).catch(err => res.json(err))
})

// @route POST api/profile/education
// @desc Add Education to the profile
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {

        const { errors, isValid } = validateEducationInput(req.body)
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from : req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        profile.education.unshift(newEdu)
        profile.save().then(profile => res.json(profile)).catch(err => res.json(err))
    })
})


// @route DELETE api/profile/experiance/:exp_id
// @desc Delete Experiances
// @access Protected
router.delete('/experiance/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({}).then(profile => {
        const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile))
    }).catch(err => res.status(404).json(err));
})
module.exports = router;