const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, name });

    const token = jwt.generateToken(user);
    await sendVerificationEmail(user, token);

    res.json({ message: 'Inscription réussie, vérifiez votre email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
