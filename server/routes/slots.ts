import express from 'express';
import { 
  getSlots, 
  getAlumniSlots, 
  createSlot, 
  updateSlot, 
  deleteSlot 
} from '../controllers/slotController.ts';

const router = express.Router();

router.get('/', getSlots);
router.get('/alumni/:alumniId', getAlumniSlots);
router.post('/', createSlot);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);

export default router;
