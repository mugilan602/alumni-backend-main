const User = require("../models/users");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signup = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        employeeType,
        position,
        companyName,
        location,
        batch,
        department,
        profileImage,
        linkedIn
    } = req.body;

    try {
        const user = await User.signup(
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            employeeType,
            position,
            companyName,
            location,
            batch,
            department,
            profileImage,
            linkedIn
        );
        const userId=user._id
        const token = createToken(user._id);
        res.status(200).json({userId,email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateImageUrl = async (req, res) => {
    const { userId } = req.params;
    const {profileImage}=req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { profileImage }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
const fetchData = async (req, res) => {
    const userId = req.user._id;
    try {
        const details = await User.findById(userId);
        res.status(200).json(details);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const fetchAlumniByDept = async (req, res) => {
    const { department } = req.params; // Assuming req.body contains the department name
  
    try {
      // Query the User collection to find users matching the specified department
      const alumniDetails = await User.find({ department});
  
      // Respond with a 200 status and JSON array of alumni details
      res.status(200).json(alumniDetails);
    } catch (error) {
      // Handle any errors that occur during the database query
      res.status(400).json({ error: error.message });
    }
  };

module.exports = { login, signup, fetchData,updateImageUrl,fetchAlumniByDept };
