var mongoose = require('mongoose')
var mongoosePassportLocal = require('passport-local-mongoose')
var userSchema = new mongoose.Schema({
  username: String,
  password: String
})
userSchema.plugin(mongoosePassportLocal)
module.exports = mongoose.model('User', userSchema)
