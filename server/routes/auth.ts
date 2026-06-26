import express from 'express';
import {
  registerStudent,
  registerAlumniStep1,
  registerAlumniStep2,
  registerAlumniStep3,
  login,
  getPendingApplications,
  approveAlumniApplication,
  rejectAlumniApplication
} from '../controllers/authController.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { requireRole } from '../middleware/rbac.ts';

const router = express.Router();

// Student Registration
router.post('/register/student', registerStudent);

// Alumni Registration (3 steps)
router.post('/register/alumni/step1', registerAlumniStep1);
router.post('/register/alumni/step2', registerAlumniStep2);
router.post('/register/alumni/step3', registerAlumniStep3);

// Login
router.post('/login', login);

// Admin: Manage Alumni Applications
router.get(
  '/admin/applications/pending',
  authenticateToken,
  requireRole('admin'),
  getPendingApplications
);
router.put(
  '/admin/applications/:id/approve',
  authenticateToken,
  requireRole('admin'),
  approveAlumniApplication
);
router.put(
  '/admin/applications/:id/reject',
  authenticateToken,
  requireRole('admin'),
  rejectAlumniApplication
);

export default router;
