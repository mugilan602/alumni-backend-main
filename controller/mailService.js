// mailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mugilan7778@gmail.com',
        pass: 'qphx dotg cdru rxzu',
    },
});

module.exports = transporter;
