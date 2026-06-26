import express from 'express';
import { 
  getResources, 
  getAlumniResources, 
  createResource, 
  updateResource, 
  deleteResource 
} from '../controllers/resourceController.ts';

const router = express.Router();

router.get('/', getResources);
router.get('/alumni/:alumniId', getAlumniResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;
