const express = require('express');
const { createEvent, getAllEvents, getMyEvents, getEventJoinStatus, requestToJoin, cancelJoinEvent, getMyPendingEvents, getParticipatedEvents, getSingleEventDetail, confirmUserToEvent, deleteUserFromEvent } = require('../controllers/eventController');
const authUser = require('../middlewares/authUser');

const router = express.Router();

router.post('/createevent',authUser,createEvent);
router.get('/allevents',authUser,getAllEvents);
router.get('/myevents',authUser,getMyEvents);
router.put('/joinevent/:eventId',authUser,requestToJoin);
router.post('/eventstatus/:eventId',authUser,getEventJoinStatus);
router.put('/canceljoin/:eventId',authUser,cancelJoinEvent);
router.get('/pending',authUser,getMyPendingEvents);
router.get('/participated',authUser,getParticipatedEvents);
router.get('/single/:eventId',authUser,getSingleEventDetail);
router.put('/myevent/adduser',authUser,confirmUserToEvent);
router.delete('/myevent/removeuser',authUser,deleteUserFromEvent);

module.exports = router;