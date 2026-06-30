//auth.controller.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');

/**
 * ===========================
 * INSCRIPTION
 * ===========================
 */
const register = async (req, res) => {
  try {

    const { email, password, name } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existing = await User.findByEmail(email);

    if (existing) {
      return res.status(400).json({
        message: 'Email déjà utilisé'
      });
    }

    // Hash du mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Génération du code de vérification
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Expiration dans 15 minutes
    const verificationExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Création de l'utilisateur
    const user = await User.create({

      email,

      password_hash,

      name,

      verification_code: verificationCode,

      verification_expires: verificationExpires

    });

    // Envoi du code par email
    await sendVerificationEmail(

      user.email,

      verificationCode

    );

    return res.status(201).json({

      message: "Compte créé. Vérifiez votre adresse email.",

      email: user.email

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      message: err.message

    });

  }
};


/**
 * ===========================
 * VERIFICATION DU CODE
 * ===========================
 */
const verifyCode = async (req, res) => {

  try {

    const { email, code } = req.body;

    // Recherche de l'utilisateur
    const user = await User.findByEmail(email);

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      });

    }

    // Vérifier le code
    if (user.verification_code !== code) {

      return res.status(400).json({

        message: "Code incorrect"

      });

    }

    // Vérifier l'expiration
    if (new Date() > user.verification_expires) {

      return res.status(400).json({

        message: "Le code a expiré"

      });

    }

    // Valider le compte
    await User.verifyEmail(user.id);

    return res.json({

      message: "Email vérifié avec succès"

    });

  }

  catch (err) {

    console.error(err);

    return res.status(500).json({

      message: err.message

    });

  }

};


/**
 * ===========================
 * CONNEXION
 * ===========================
 */
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {

      return res.status(400).json({

        message: "Email ou mot de passe incorrect"

      });

    }

    const match = await bcrypt.compare(

      password,

      user.password_hash

    );

    if (!match) {

      return res.status(400).json({

        message: "Email ou mot de passe incorrect"

      });

    }

    if (!user.is_verified) {

      return res.status(403).json({

        message: "Veuillez vérifier votre adresse email."

      });

    }

    const token = jwt.generateToken(user);

    return res.json({

      token,

      user: {

        id: user.id,

        email: user.email,

        name: user.name,

        role: user.role,

        photo_url: user.photo_url

      }

    });

  }

  catch (err) {

    console.error(err);

    return res.status(500).json({

      message: err.message

    });

  }

};


module.exports = {

  register,

  verifyCode,

  login

};