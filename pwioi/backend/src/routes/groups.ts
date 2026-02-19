import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addMember
} from '../controllers/groupController.js';

const router = Router();

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/members', addMember);

export default router;
