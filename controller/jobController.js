const Job = require("../models/job");
const Student = require("../models/student");
const User = require("../models/users");

const createJob = async (req, res) => {
    const userId = req.user._id;
    const { title, company, pay, experience, appliedBy } = req.body;
    
    try {
        // Create the job
        const job = await Job.create({
            title,
            company,
            pay,
            experience,
            appliedBy,
            userId
        });
        
        const jobId = job._id;

        // Update the user with the jobId
        await User.findByIdAndUpdate(userId, { $push: { jobs: jobId } });

        res.status(200).json({ jobId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        // Fetch all jobs from the database and populate student and user details
        const jobs = await Job.find()
        .populate({
            path: 'appliedBy',
            model: 'Student'
        })
        .populate({
            path: 'userId',
            model: 'User'
        })
        .exec();

        // If there are no jobs, send an appropriate response
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found' });
        }

        // Send the jobs as a response
        res.status(200).json({ jobs });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};

const getJobById = async (req, res) => {
    const { jobId } = req.params; // Extract jobId from req.params
    try {
        // Fetch the job by ID from the database and populate student and user details
        const job = await Job.findById(jobId)
            .populate({
                path: 'appliedBy',
                model: 'Student'
            })
            .exec();

        // If no job is found, send an appropriate response
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Send the job as a response
        res.status(200).json({ job });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};


const apply = async (req, res) => {
    const { jobId } = req.params;
    const { name, email, phoneNumber, resume } = req.body;

    try {
        // Find the student by email
        let student = await Student.findOne({ email });

        if (!student) {
            // Student does not exist, create a new student document
            student = new Student({
                name,
                email,
                phoneNumber,
                resume,
                jobIds: [jobId] // Initialize jobIds array with the provided jobId
            });
            await student.save();
        } else {
            // Student exists, update the jobIds array if jobId not already present
            if (!student.jobIds.includes(jobId)) {
                student.jobIds.push(jobId);
                await student.save();
            }
        }

        // Update the Job document's appliedBy field with student's _id
        await Job.findByIdAndUpdate(jobId, { $addToSet: { appliedBy: student._id } }, { new: true });

        res.status(200).json({ student });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createJob, apply ,getJobs,getJobById};
