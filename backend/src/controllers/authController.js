const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

// ─── Validation rules ──────────────────────────────────────────────────────
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email wajib diisi.')
    .isEmail().withMessage('Format email tidak valid.'),
  body('password')
    .notEmpty().withMessage('Password wajib diisi.')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
];

// ─── POST /api/auth/login ───────────────────────────────────────────────────
async function login(req, res) {
  // 1. Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()[0].msg,
      errors:  errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // 2. Find user
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password yang Anda masukkan salah.',
      });
    }

    const user = rows[0];

    // 3. Check active status
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan. Hubungi administrator.',
      });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password yang Anda masukkan salah.',
      });
    }

    // 5. Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // 6. Sign JWT
    const token = jwt.sign(
      {
        id:    user.id,
        email: user.email,
        role:  user.role,
        name:  user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // 7. Return response (never return password hash)
    return res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id:     user.id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('[login] DB error:', err);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server. Coba lagi nanti.',
    });
  }
}

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
async function me(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar, last_login, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('[me] error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// ─── POST /api/auth/logout ──────────────────────────────────────────────────
function logout(req, res) {
  // JWT is stateless — client deletes the token
  return res.json({ success: true, message: 'Logout berhasil.' });
}

module.exports = { login, loginValidation, me, logout };
