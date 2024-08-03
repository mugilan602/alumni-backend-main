require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const app = express();
const cors =require("cors")
app.use(express.json());

app.use(cors());
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
