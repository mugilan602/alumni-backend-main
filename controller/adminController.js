const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const transporter = require('./mailService'); // Import the transporter
const Job = require("../models/job");
const Student = require("../models/student")
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


const authorizeUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { isAuthorized: 'authorized' }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const mailOptions = {
            from: 'mugilan7778@gmail.com',
            to: user.email,
            subject: 'Authorization Status',
            text: `Hello ${user.firstName},\n\nYour account has been successfully authorized.\n\nBest regards,\nYour Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Server error' });
            }
            res.status(200).json({ user, message: `Authorization successful. Email sent: ${info.response}` });
        });
    } catch (error) {
        console.error('Error authorizing user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const authorizedUser = async (req, res) => {
    try {
        const users = await User.find({ isAuthorized: 'authorized' });

        if (!users.length) {
            return res.status(404).json({ error: 'No authorized users found' });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching authorized users:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const unAuthorizedUser = async (req, res) => {
    try {
        const users = await User.find({ isAuthorized: 'not authorized' });

        if (!users.length) {
            return res.status(404).json({ error: 'No unauthorized users found' });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching unauthorized users:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
const getJobCount = async (req, res) => {
    try {
        // Count all jobs in the database
        const jobCount = await Job.countDocuments();

        // Send the count as a response
        res.status(200).json({ jobCount });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};
const getUnAuthorizedAlumniCount = async (req, res) => {
    try {
        // Count all authorized alumni in the database
        const unauthorizedCount = await User.countDocuments({ isAuthorized: 'not authorized' });

        // Send the count as a response
        res.status(200).json({ unauthorizedCount });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

const getAppliedStudentsCount = async (req, res) => {
    try {
        // Count all students in the database
        const studentsCount = await Student.countDocuments();

        // Check if studentsCount is greater than zero
        if (studentsCount > 0) {
            // Send the count as a response
            res.status(200).json({ studentsCount });
        } else {
            // Send an empty response if the count is zero
            res.status(200).json({});
        }
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};


const getAllAppliedStudents = async (req, res) => {
    try {
        // Fetch all students and populate jobIds and userId fields
        const students = await Student.find()
            .populate({
                path: 'jobIds', // Populating the jobIds field
                populate: {
                    path: 'userId', // Nested populate for userId in Job
                    model: 'User' // The model to populate
                },
                model: 'Job' // The model to populate
            })
            .exec();

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching students with job and user details:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    login, signup, authorizeUser, authorizedUser, unAuthorizedUser, getJobCount, getAllAppliedStudents, getUnAuthorizedAlumniCount, getAppliedStudentsCount
};
