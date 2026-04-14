const { pool } = require('../config/database');

// ─── GET /api/dashboard/stats ───────────────────────────────────────────────
async function getStats(req, res) {
  try {
    const [[{ totalUsers }]] = await pool.query(
      'SELECT COUNT(*) AS totalUsers FROM users WHERE is_active = 1'
    );

    const [[{ newToday }]] = await pool.query(
      'SELECT COUNT(*) AS newToday FROM users WHERE DATE(created_at) = CURDATE()'
    );

    return res.json({
      success: true,
      stats: {
        totalUsers,
        newToday,
        revenue:    '128.4',
        growth:     '+12.5',
        orders:     '1.842',
        conversion: '3.2',
      },
    });
  } catch (err) {
    console.error('[getStats]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// ─── GET /api/dashboard/users ───────────────────────────────────────────────
async function getUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, is_active, last_login, created_at
       FROM users ORDER BY created_at DESC LIMIT 10`
    );
    return res.json({ success: true, users: rows });
  } catch (err) {
    console.error('[getUsers]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { getStats, getUsers };
