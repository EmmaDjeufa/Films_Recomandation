//email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("SMTP connecté");
    }
});

const sendVerificationEmail = async (email, code) => {

    const info = await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject: "Code de vérification",

        html: `
            <h2>Bienvenue !</h2>

            <p>Votre code de vérification est :</p>

            <h1 style="letter-spacing:5px">${code}</h1>

            <p>Ce code expire dans 15 minutes.</p>
        `
    });

    console.log(info);
};

module.exports = { sendVerificationEmail };
