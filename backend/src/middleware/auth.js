import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../db.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// attach user to req if token valid
export async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization required' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload contains user_id, username, role, user_ref_id
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT error', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// require the user to have a specific role (or admin allowed)
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role === 'admin') return next();
    if (req.user.role === role) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

// For manager-specific actions on a building, allow admin or manager assigned to that building in the current period
export async function checkManagerBuilding(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role === 'admin') return next();
  if (req.user.role !== 'manager') return res.status(403).json({ error: 'Forbidden' });

  const managerId = req.user.user_ref_id; // refers to managers.manager_id
  let buildingId = req.params.id || req.body.building_id;

  // allow checking via room_id when building_id is not provided
  if (!buildingId && req.params.room_id) {
    try {
      const [roomRows] = await db.query('SELECT building_id FROM rooms WHERE room_id = ? LIMIT 1', [req.params.room_id]);
      if (roomRows.length > 0) {
        buildingId = roomRows[0].building_id;
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (!buildingId) return res.status(400).json({ error: 'Building id required' });

  try {
    // check if manager is assigned to building in any period (or we could check current period)
    const [rows] = await db.query('SELECT 1 FROM manager_building WHERE manager_id = ? AND building_id = ? LIMIT 1', [managerId, buildingId]);
    if (rows.length === 0) return res.status(403).json({ error: 'Manager not assigned to this building' });
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
