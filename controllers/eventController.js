const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

const images = {
    cricket: "https://wallpaperaccess.com/full/1088580.jpg",
    volleyball: "https://media.istockphoto.com/id/481671830/photo/friends-playing-volleyball.jpg?s=612x612&w=0&k=20&c=GBLfoCDmFV5JzLWOJ9YTXzqJ97q0npBnAIIklpZuoZc=",
    badminton: "https://us.123rf.com/450wm/noprati/noprati2205/noprati220500001/noprati220500001.jpg?ver=6",
    football: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTVyQQaPPQ_j9FIUtPzOIWm6-fA6nJHKd-ClMOWvAyO-Iyg7INOeYyn65tLuFcI24zMY&usqp=CAU",
    basketball: "https://wallpaperaccess.com/full/720058.jpg"
}

const createEvent = asyncHandler(async (req,res) => {
    try {
        const user = req.user;
        const event = await Event.create({...req.body,image:images[req.body.eventName],createdBy:user._id});
        user.myEvents.push(event._id);
        await user.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

const addParticipant = async (req, res) => {
    const id = req.params.id;
    console.log(id, req.body.name)
    const result = await Event.findOne({ _id: id });
    result.currentParticipants.push(req.body.name);
    result.save();

    await User.findOneAndUpdate({ username: req.body.name }, { $push: { participated: result._id } });
    res.send(result);
}

const getSingleEvent = async (req, res) => {
    const id = req.params.id;
    const result = await Event.findOne({ _id: id });
    res.send(result);
}

const addPending = async (req, res) => {
    const id = req.params.id;
    const result = await Event.findOne({ _id: id });
    result.pending.push(req.body.name);
    result.save()

    await User.findOneAndUpdate({ username: req.body.name }, { $push: { pending: result._id } });

    res.send(result);
}

const myEvents = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).populate("myEvents").populate("participated").populate("pending");
    res.send(user);
}

const getEvents = async (req, res) => {
    const username = req.params.username;
    const event = await Event.find({ createdBy: { $nin: username } });
    res.send(event);
}

const deletPending = async (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    const event = await Event.updateOne({ _id: id },
        {
            $pull: { pending: name }
        }
    )

    await User.findOneAndUpdate({ username: name }, { $pull: { pending: id } });

    res.send(event);
}

const searchEvents = async (req, res) => {
    const username = req.params.username;
    const key = req.params.key;
    const event = await Event.find({
        "$and": [{ createdBy: { $nin: username } },
        {
            "$or": [
                { eventName: { $regex: key, $options: "i" } },
                { createdBy: { $regex: key, $options: "i" } },
            ]
        }]
    });
    res.send(event);
}

const getAllEvents = asyncHandler(async (req,res)=> {
    // console.log(req.user);
    try {
        const allevents = await Event.find({createdBy:{$ne:req.user._id}}).populate({
            path:'createdBy',
            select: 'username'
        });
        res.status(200).json(allevents);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

const getMyEvents = asyncHandler(async (req,res) => {
    try {
        const events = await Event.find({createdBy:req.user._id}).populate({
            path:'createdBy',
            select: 'username'
        });
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

const getMyPendingEvents = asyncHandler(async (req,res) => {
    try {
        // const events = req.user.pending.map(async id=> await Event.findById(id));
        const user = await User.findById(req.user._id).populate('pending');
        // console.log(req.user);
        res.status(200).json(user.pending);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

const requestToJoin = asyncHandler(async (req,res)=> {
    try {
        const {eventId} = req.params;
        const user = req.user;
        const event = await Event.findById(eventId);
        if(event.pending.includes(user._id)) {
            return res.status(400).json({msg:"pending confirmation"});
        }
        if(event.currentParticipants.includes(req._id)){
            return res.status(400).json({msg:"already participated"});
        }
        event.pending.push(user._id);
        user.pending.push(event._id);
        await event.save();
        await user.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

const getEventJoinStatus = asyncHandler(async (req,res)=> {
    try {
        const user = req.user;
        const {eventId} = req.params;
        if(user.pending.includes(eventId)){
            return res.status(200).json("Pending..");
        }
        if(user.participated.includes(eventId)) {
            return res.status(200).json("Participated");
        }
        return res.status(200).json("Request to Join");
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

const cancelJoinEvent = asyncHandler(async (req,res) => {
    try {
        const user = req.user;
        const {eventId} = req.params;
        const event = await Event.findById(eventId);
        event.pending = event.pending.filter(ev=>ev.toString() !== user._id.toString());
        user.pending = user.pending.filter(ev=>ev.toString() !== event._id.toString());
        await event.save();
        await user.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})


module.exports = { createEvent ,getAllEvents,getMyEvents,getEventJoinStatus,requestToJoin,cancelJoinEvent,getMyPendingEvents}