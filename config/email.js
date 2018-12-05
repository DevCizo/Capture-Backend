// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport("SMTP", {
//     host: 'smtp.sendgrid.net',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'jigsvirani5744', // generated ethereal user
//         pass: 'Admin@123' // generated ethereal password
//     }
// });


const transporter = require('@sendgrid/mail');
transporter.setApiKey('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');


module.exports = transporter;
