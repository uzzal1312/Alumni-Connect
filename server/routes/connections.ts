import express from 'express';
import { 
  getConnections, 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  rejectConnectionRequest,
  getAlumniConnections,
  updateConnectionStatus
} from '../controllers/connectionController.ts';

const router = express.Router();

router.get('/user/:userId', getConnections);
router.get('/alumni/:alumniId/:status', getAlumniConnections);
router.post('/request', sendConnectionRequest);
router.put('/:id/accept', acceptConnectionRequest);
router.put('/:id', updateConnectionStatus);
router.delete('/:id/reject', rejectConnectionRequest);

export default router;
