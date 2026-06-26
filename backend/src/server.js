//server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// =====================
// CORS CONFIG
// =====================
const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      'https://upgraded-happiness-grrq944qqg5fw569-4200.app.github.dev',
      'http://localhost:4200'
    ];

    // DEV FIX IMPORTANT
    if (!origin) return callback(null, true);

    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked origin:", origin);
    return callback(null, true); // 👈 IMPORTANT EN DEV (NE PAS BLOQUER)
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 1️⃣ CORS FIRST
app.use(cors(corsOptions));

// 2️⃣ FORCE PRE-FLIGHT HANDLING
app.options(/.*/, cors(corsOptions));

// 3️⃣ JSON AFTER
app.use(express.json());

// 4️⃣ LOGGING AFTER
app.use((req, res, next) => {
  console.log('REQ =>', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log("ORIGIN:", req.headers.origin);
  next();
});

// =====================
// ROUTES
// =====================
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const filmRoutes = require('./routes/film.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/admin', adminRoutes);

// =====================
// TEST ROUTE
// =====================
app.get('/test', (req, res) => {
  res.json({ message: 'Backend OK' });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));