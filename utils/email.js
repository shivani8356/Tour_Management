const nodemailer = require('nodemailer');

const sendEmail = async (option)=>{
// creating a transporter
const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD
    }
});
// DEFINE EMAI OPTIONS
const emailOptions = {
    from : "Tour Management support <support@tourmanagement.com>",
    to : option.email,
    subject : option.subject , 
    text : option.message
}
await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;