const express = require('express');
const router = express.Router();
const {
    login,
    signup,
    authorizeUser,
    authorizedUser,
    unAuthorizedUser,
    getJobCount,
    getAllAppliedStudents,
    getUnAuthorizedAlumniCount,
    getAppliedStudentsCount } = require('../controller/adminController');
const { getJobs } = require("../controller/jobController");

router.post("/login", login);
router.post("/signup", signup);
// Authorization routes
router.patch("/authorize", authorizeUser);


router.get("/getJobs", getJobs);
router.get("/getJobCount", getJobCount);
router.get("/getAllAppliedStudents", getAllAppliedStudents);
router.get('/unauthorized-alumni-count', getUnAuthorizedAlumniCount);
router.get('/getAppliedStudentsCount', getAppliedStudentsCount);

// Fetch users
router.get('/authorized-users', authorizedUser);
router.get('/unauthorized-users', unAuthorizedUser);


module.exports = router;