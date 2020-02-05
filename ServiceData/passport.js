const { Strategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const { secretOrKey } = require('../ServiceData/keys')

const opts  = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey

module.exports = passport => {
    passport.use(new Strategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id).then(user => {
            return user ? done(null, user)  : done(null, false);
        }).catch(err => {
            console.log(err)
        })
    }))
};