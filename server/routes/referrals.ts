import express from 'express';
import {
    createReferralRequest,
    getStudentReferralRequests,
    getAlumniReferralRequests,
    updateReferralRequestStatus
} from '../controllers/referralController.js';

const router = express.Router();

router.post('/', createReferralRequest);
router.get('/student/:studentId', getStudentReferralRequests);
router.get('/alumni/:alumniId', getAlumniReferralRequests);
router.put('/:id/status', updateReferralRequestStatus);

export default router;
