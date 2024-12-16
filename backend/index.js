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

