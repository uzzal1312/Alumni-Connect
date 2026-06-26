import express from 'express';
import upload from '../config/multer.ts';
import { 
  getJobs, 
  getJobById, 
  createJob, 
  applyForJob, 
  getAlumniJobs, 
  updateJob, 
  deleteJob, 
  closeJob, 
  getJobApplications, 
  getStudentJobApplications, 
  updateApplicationStatus 
} from '../controllers/jobController.ts';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/alumni/:alumniId', getAlumniJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.put('/:id/close', closeJob);
router.post('/:id/apply', upload.single('resume'), applyForJob);
router.get('/student/:studentId/applications', getStudentJobApplications);
router.get('/student/:studentId/applications', getStudentJobApplications);
router.get('/:id/applications', getJobApplications);
router.put('/applications/:id', updateApplicationStatus);

export default router;
