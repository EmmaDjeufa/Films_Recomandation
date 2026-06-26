//email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((err, success) => {
  if (err) {
    console.error("Erreur SMTP :", err);
  } else {
    console.log("SMTP connecté");
  }
});

const sendVerificationEmail = async (user, token) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const url = `${process.env.FRONTEND_URL}/verify/${token}`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Vérification",
    html: `<a href="${url}">Valider</a>`
  });

  console.log("Email envoyé !");
  console.log(info);
};

module.exports = { sendVerificationEmail };
