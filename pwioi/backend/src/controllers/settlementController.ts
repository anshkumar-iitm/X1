import { Request, Response } from 'express';
import { Settlement } from '../models/Settlement.js';

export async function getSettlements(req: Request, res: Response) {
  try {
    const { groupId } = req.query;
    const { address } = req.query;

    let query: any = {};
    if (groupId) query.groupId = groupId;
    if (address) {
      query.$or = [
        { fromAddress: address },
        { toAddress: address }
      ];
    }

    const settlements = await Settlement.find(query).sort({ createdAt: -1 });
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settlements' });
  }
}

export async function markSettlementPaid(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { txnId } = req.body;

    const settlement = await Settlement.findByIdAndUpdate(
      id,
      { isPaid: true, txnId },
      { new: true }
    );

    if (!settlement) {
      return res.status(404).json({ error: 'Settlement not found' });
    }

    res.json(settlement);
  } catch (error) {
    res.status(400).json({ error: 'Failed to mark settlement as paid' });
  }
}

export async function getGroupSettlements(req: Request, res: Response) {
  try {
    const { groupId } = req.params;

    const settlements = await Settlement.find({
      groupId,
      isPaid: false
    }).sort({ createdAt: -1 });

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group settlements' });
  }
}

export async function getPendingSettlements(req: Request, res: Response) {
  try {
    const { address } = req.params;

    const settlements = await Settlement.find({
      $or: [
        { fromAddress: address, isPaid: false },
        { toAddress: address, isPaid: false }
      ]
    }).sort({ createdAt: -1 });

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending settlements' });
  }
}
