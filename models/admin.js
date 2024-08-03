const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

adminSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const admin = await this.findOne({ userName: email }); // Using 'userName' field to find by email
    if (!admin) {
        throw new Error("Admin not found");
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
        throw new Error("Incorrect password");
    }

    return admin;
};

adminSchema.statics.signup = async function(userName, password) {
    const existingAdmin = await this.findOne({ userName });
    if (existingAdmin) {
        throw new Error("Username already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = await this.create({
        userName,
        password: hash // Store hashed password in the database
    });

    return admin;
};

module.exports = mongoose.model('Admin', adminSchema);
