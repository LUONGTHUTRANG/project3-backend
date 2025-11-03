import express from 'express';
import buildings from './buildings.js';
import auth from './auth.js';

const router = express.Router();

router.use('/buildings', buildings);
router.use('/auth', auth);

// TODO: add routes for rooms, staff, registrations, notices, payments, students, requests

router.get('/', (req, res) => res.json({ ok: true }));

export default router;
