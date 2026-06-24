//server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const filmRoutes = require('./routes/film.routes');
const adminRoutes = require('./routes/admin.routes');

app.use(express.json());
app.use((req, res, next) => {
  console.log('REQ =>', req.method, req.url);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.get('/test', (req, res) => {
  res.json({ message: 'Backend OK' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
