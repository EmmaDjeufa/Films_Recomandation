//auth.controller.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');
const verifyCode = async (...);

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    console.log("Début register");

    //const token = jwt.generateToken(user);
    const verificationCode = Math.floor(
    100000 + Math.random() * 900000
    ).toString();

    const verificationExpires = new Date(
    Date.now() + 15 * 60 * 1000
    );
    console.log("Token créé"); 

    const user = await User.create({ email, password_hash, name, verification_code: verificationCode, verification_expires: verificationExpires });
    console.log("Utilisateur créé");

    // Envoi du mail de vérification
    sendVerificationEmail(
      user.email,
      verificationCode
    );
    console.log("Email envoyé");

    return res.json({
      message: 'Inscription réussie. Vérifiez votre boîte mail.',
      email:user.email
    });
    
    if(!user){

      return res.status(404).json({
      message:"Utilisateur introuvable"
      });

      }
      if(user.verification_code!==code){

      return res.status(400).json({
      message:"Code incorrect"
      });

      }
    if(
      new Date()>user.verification_expires
      ){

      return res.status(400).json({
      message:"Code expiré"
      });

      }
      await User.verifyEmail(user.id);
      res.json({
      message:"Email vérifié"
      });
  } catch (err) {
    console.error('Erreur register:', err);
    return res.status(500).json({ message: err.message });
  }
};





const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    if (!user.is_verified) return res.status(403).json({ message: 'Email non vérifié' });

    const token = jwt.generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, photo_url: user.photo_url } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verifyToken(token);
    const user = await User.verifyEmail(decoded.id);
    res.json({ message: 'Email vérifié avec succès', user });
  } catch (err) {
    res.status(400).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { register, login, verifyEmail };
