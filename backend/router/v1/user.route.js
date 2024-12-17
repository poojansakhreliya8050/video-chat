const express = require('express');
const router = express.Router();
const { userRegister, userLogin,createRoom,deleteRoom,addUserToRoom,removeUserFromRoom,getUsersInRoom, } = require('../../controller/user.controller');

router.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
}
);

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/room", createRoom);
router.delete("/room/:id", deleteRoom);
router.post("/room/:id/user", addUserToRoom);
router.delete("/room/:id/user", removeUserFromRoom);
router.get("/room/:id/user", getUsersInRoom);


module.exports = router;