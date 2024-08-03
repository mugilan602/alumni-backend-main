const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number, // Assuming phoneNumber is a numeric value
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    jobIds: [{
        type: Schema.Types.ObjectId, // Array of ObjectId
        ref: 'Job' // Referencing the Job model
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Student', studentSchema);
