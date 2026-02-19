import { Router } from 'express';
import {
  getSettlements,
  markSettlementPaid,
  getGroupSettlements,
  getPendingSettlements
} from '../controllers/settlementController.js';

const router = Router();

router.get('/', getSettlements);
router.put('/:id', markSettlementPaid);
router.get('/group/:groupId', getGroupSettlements);
router.get('/pending/:address', getPendingSettlements);

export default router;
