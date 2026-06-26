import express from 'express';
import { 
  getStudentBookings, 
  getAlumniBookings, 
  createBooking, 
  updateBookingStatus 
} from '../controllers/bookingController.ts';

const router = express.Router();

router.get('/student/:studentId', getStudentBookings);
router.get('/alumni/:alumniId', getAlumniBookings);
router.post('/', createBooking);
router.put('/:id', updateBookingStatus);

export default router;
