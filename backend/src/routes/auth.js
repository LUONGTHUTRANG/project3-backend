import express from 'express';
import ctrl from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);

export default router;
