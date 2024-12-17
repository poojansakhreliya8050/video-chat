const User = require('../model/user.model');
const Room = require('../model/room.model');

const userRegister = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send(error);
    }
}

const userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ username:req.body.username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).send(error);
    }
}


//create room for user to join
const createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).send(room);
    } catch (error) {
        res.status(400).send(error);
    }
}

//delete room
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).send('Room not found');
        }
        res.status(200).send('Room deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

//add one user to room
const addUserToRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).send('Room not found');
        }
        room.users.push(req.body);
        await room.save();
        res.status(200).send(room);
    } catch (error) {
        res.status(400).send(error);
    }
}

//remove one user from room
const removeUserFromRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).send('Room not found');
        }
        room.users = room.users.filter(user => user._id != req.body.userId);
        await room.save();
        res.status(200).send(room);
    } catch (error) {
        res.status(400).send(error);
    }
}

//get all users in room
const getUsersInRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).send('Room not found');
        }
        res.status(200).send(room.users);
    } catch (error) {
        res.status(400).send(error);
    }
}



module.exports = {
    userRegister,
    userLogin,
    createRoom,
    deleteRoom,
    addUserToRoom,
    removeUserFromRoom,
    getUsersInRoom,
}