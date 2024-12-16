const User = require('../model/user.model');

const userRegister = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
}

const userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ username:
            req.body.username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }
        res.status(200).send('Login successful');
    }
    catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    userRegister,
    userLogin,
}