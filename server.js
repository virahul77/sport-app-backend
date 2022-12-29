const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute');
const eventRouter = require('./routes/eventRoute');
const cors = require('cors');
const errorHandler = require('./middlewares/errorMiddleware');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/user',userRouter);
app.use('/event',eventRouter);


app.get('/',(req,res)=> {
    res.status(200).send('welcome to sports club api');
})

// app.use(errorHandler);


//connect to DB then start server

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then((conn)=>{
    console.log('connected to DB',conn.connection.host);
    app.listen(PORT,()=>{
        console.log('server running at port',PORT);
    })
})