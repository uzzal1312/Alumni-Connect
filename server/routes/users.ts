import express from 'express';
import upload from '../config/multer.ts';
import { 
  getUsers, 
  getUserProfile, 
  updateUserProfile, 
  updateStudentProfile, 
  updateAlumniProfile, 
  addWorkHistory, 
  updateWorkHistory,
  deleteWorkHistory 
} from '../controllers/userController.ts';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserProfile);
router.put('/:id', upload.single('profilePicture'), updateUserProfile);
router.put('/:id/student-profile', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateStudentProfile);
router.put('/:id/alumni-profile', updateAlumniProfile);
router.post('/:id/work-history', addWorkHistory);
router.put('/work-history/:id', updateWorkHistory);
router.delete('/work-history/:id', deleteWorkHistory);

export default router;
