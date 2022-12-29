const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'name can not be empty'],
        unique: [true,'this username already taken'],
        trim: true
    },
    password: {
        type: String,
        required: [true,'password can not be empty'],
        trim: true
    },
    myEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ],
    participated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ],
    pending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    }]
})

const User = mongoose.model('users',userModel);

module.exports = User;