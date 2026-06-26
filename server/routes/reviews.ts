import express from 'express';
import {
    createSessionReview,
    getAlumniReviews,
    getReviewForBooking
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createSessionReview);
router.get('/alumni/:alumniId', getAlumniReviews);
router.get('/booking/:bookingId', getReviewForBooking);

export default router;
