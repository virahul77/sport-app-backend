const mongoose = require('mongoose');

// const eventSchema = new mongoose.Schema({
//     eventName: {
//         type: String,
//         require: [true,'please add a event name'],
//         trim: true
//     },
//     createdBy: {
//         type: String,
//         require: true,
//         trim: true
//     },
//     totalSeats: {
//         type: Number,
//         require: true
//     },
//     description: {
//         type: String,
//         trim: [true,'please add description']
//     },
//     image: {
//         type: String
//     },
//     currentParticipants: [String],
//     pending: [String]
// })

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: [true,'please add a event name'],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        require: [true,'please specify user'],
    },
    totalSeats: {
        type: Number,
        require: [true,'please specify total seats']
    },
    description: {
        type: String,
        trim: [true,'please add description']
    },
    image: {
        type: String
    },
    currentParticipants: [{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
    pending: [{type:mongoose.Schema.Types.ObjectId,ref:'users'}],
    startDate: Date,
    venue: String
})


const Event = mongoose.model('events',eventSchema);
module.exports = Event;