const admin  = require('firebase-admin')
const serievAccount = require('./ServiceData/FireBaseServiceData.json')
const { mongoURI } = require('./ServiceData/keys')
const mongoose  = require('mongoose')


// Firebase Initialization
admin.initializeApp({
    credential: admin.credential.cert(serievAccount)
})

const db = admin.firestore()


// MongoDB initialization
const mongoClient = mongoose.connect(mongoURI).then(() => console.log("Mongo DB Connected"))
.catch(err => console.log(err))

module.exports = {
    firbase: db,
    mongo: mongoClient
}