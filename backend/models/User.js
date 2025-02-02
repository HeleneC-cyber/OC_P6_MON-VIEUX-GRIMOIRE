// Import
const mongoose = require('mongoose')



// Create a data schema for adding a user
const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, // only one registration per e-mail
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email format validation
    }, 
    password: { type: String, required: true }, //Other possible password characteristics : minlength: 6
})



// Export User model
module.exports = mongoose.model('User', userSchema)