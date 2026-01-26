const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (user, token) => {
  const url = `http://localhost:4200/verify/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Vérification email',
    html: `<p>Bonjour ${user.name}, cliquez sur ce lien pour vérifier votre email: <a href="${url}">${url}</a></p>`,
  });
};

module.exports = { sendVerificationEmail };
