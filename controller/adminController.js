const Admin = require("../models/admin"); // Import Admin model
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
};

const login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const admin = await Admin.login(userName, password); // Assuming Admin model has a login method
        const token = createToken(admin._id);
        res.status(200).json({ userName: admin.userName, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signup = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const admin = await Admin.signup(userName, password); // Assuming Admin model has a signup method
        const token = createToken(admin._id);
        res.status(200).json({ userName: admin.userName, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { login, signup};
