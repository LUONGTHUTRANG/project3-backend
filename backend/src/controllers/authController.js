import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

// Login: accept username (MSSV OR email OR phone OR admin username) and password
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const [rows] = await db.query('SELECT * FROM sys_users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const stored = user.password || '';

    let passwordMatches = false;
    try {
      // if stored is a bcrypt hash, compare; otherwise allow plain text match for legacy/demo data
      if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
        passwordMatches = await bcrypt.compare(password, stored);
      } else {
        passwordMatches = stored === password;
      }
    } catch (e) {
      passwordMatches = stored === password;
    }

    if (!passwordMatches) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      user_id: user.user_id,
      username: user.username,
      role: user.user_role,
      user_ref_id: user.user_ref_id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Return current user info (from token)
function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: req.user });
}

export default { login, me };
