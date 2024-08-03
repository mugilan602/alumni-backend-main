const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true
    },
    pay: {
        type: String, // Assuming pay is a numeric value
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    appliedBy: [{
        type: Schema.Types.ObjectId, // Array of ObjectId
        ref: 'Student' // Assuming there is a User model
    }],
    userId: {
        type: Schema.Types.ObjectId, // Referencing the ObjectId type
        ref: 'User', // Assuming there is a User model
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Job', jobSchema);
