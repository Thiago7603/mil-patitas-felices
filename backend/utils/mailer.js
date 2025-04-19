const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResetEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Código de recuperación de contraseña',
    html: `<p>Tu código de recuperación es: <b>${code}</b></p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
