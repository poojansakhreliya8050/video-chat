const express = require('express');
const app = express();
const http = require('http').createServer(app);
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', require('./router/v1'));

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});


io.on('connection', (socket) => {
    console.log('a user connected with id: ' + socket.id);
        
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('join-room', (roomId, userId) => {
        // console.log('user joined room: ' + roomId +" with id: "+userId);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });

    //when user join then user also send offer
    socket.on('offer', (data) => {
        // console.log('offer from: ' + socket.id + " to: " + data.to);
        socket.to(data.to).emit('offer', {offer:data.offer,from:socket.id,to:data.to});
    });

    //when user send answer
    socket.on('answer', (data) => {
        // console.log('answer from: ' + socket.id+ " to: " + data.to);
        socket.to(data.to).emit('answer', {answer:data.answer,from:socket.id,to:data.to});
    });

    //when user send ice candidate
    socket.on('ice-candidate', (data) => {
        // console.log('ice-candidate from: ' + socket.id + " to: " + data.to);
        socket.to(data.to).emit('ice-candidate', {candidate:data.candidate,from:socket.id,to:data.to});
    });

    //when user leave the room
    socket.on('leave-room', (roomId, userId) => {
        console.log('user leave room: ' + roomId +" with id: "+userId);
        socket.to(roomId).emit('user-disconnected', userId);
    });



}

);

async function startServer() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to db');

    const port = process.env.PORT || 8000;
    http.listen(port, () => {
        console.log(`listening on ${port}...`);
    });
}

startServer();

