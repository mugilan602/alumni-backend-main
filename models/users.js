const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    employeeType: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Contract'],
        required: true
    },
    position: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ''
    }, jobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],linkedIn:{
        type:String,
        required:true
    }
});

userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error("All fields must be filled");
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Incorrect password");
    }
    return user;
};

userSchema.statics.signup = async function(email, password, firstName, lastName, phoneNumber, employeeType, position, companyName, location, batch, department, profileImage = '',linkedIn) {
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        email,
        password: hash,
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
    });
    return user;
};

module.exports = mongoose.model('User', userSchema);
