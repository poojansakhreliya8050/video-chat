const User = require('../model/user.model');
const Room = require('../model/room.model');
const {generateToken} = require('../utils/jwt'); 
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const jwtToken= generateToken(user._id);
        res.cookie("token",jwtToken,{httpOnly:true,maxAge:7 * 24 * 60 * 60 * 1000,secure:false});
        res.status(200).json(user);
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
        const jwtToken=generateToken(user._id);
        res.cookie("token",jwtToken,{httpOnly:true,maxAge:7 * 24 * 60 * 60 * 1000,secure:false});
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).send(error);
    }
}

const userLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).send('Logout successfully');
    } catch (error) {
        res.status(400).send(error);
    }
}

const me = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Please authenticate');
        }
        const jwtToken= jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: jwtToken.id});
        if (!user) {
            return res.status(401).send('user not found');
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(401).send('Please authenticate');
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

//room exist or not
const roomExist = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).send('Room not found');
        }
        req.room = room;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}



module.exports = {
    userRegister,
    userLogin,
    userLogout,
    me,
    createRoom,
    deleteRoom,
    addUserToRoom,
    removeUserFromRoom,
    getUsersInRoom,
    roomExist
}