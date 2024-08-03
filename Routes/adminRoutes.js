const express = require('express');
const router = express.Router();
const {login,signup}=require("../controller/adminController");

router.post("/login", login);
router.post("/signup", signup);

module.exports = router;