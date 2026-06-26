import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  manageUser,
  getAnalytics,
  getStudentById,
  updateStudent,
  bulkManageUsers
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.get('/stats', authenticateToken, requireRole('admin'), getDashboardStats);
router.get('/users', authenticateToken, requireRole('admin'), getAllUsers);
router.get('/users/student/:id', authenticateToken, requireRole('admin'), getStudentById);
router.put('/users/:id', authenticateToken, requireRole('admin'), manageUser);
router.put('/users/student/:id', authenticateToken, requireRole('admin'), updateStudent);
router.post('/users/bulk', authenticateToken, requireRole('admin'), bulkManageUsers);
router.get('/analytics', authenticateToken, requireRole('admin'), getAnalytics);

export default router;
