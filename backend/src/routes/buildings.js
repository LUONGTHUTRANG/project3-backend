import express from 'express';
import ctrl from '../controllers/buildingsController.js';
import { authenticate, requireRole, checkManagerBuilding } from '../middleware/auth.js';

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
// create: only admin can create buildings
router.post('/', authenticate, requireRole('admin'), ctrl.create);
// update: admin or manager assigned to building
router.put('/:id', authenticate, checkManagerBuilding, ctrl.update);
// delete: only admin
router.delete('/:id', authenticate, requireRole('admin'), ctrl.remove);

export default router;
