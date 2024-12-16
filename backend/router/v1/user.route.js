const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require('../../controller/user.controller');

router.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
}
);

router.post("/register", userRegister);
router.post("/login", userLogin);


module.exports = router;