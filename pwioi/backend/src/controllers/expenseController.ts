import { Request, Response } from 'express';
import { Expense } from '../models/Expense.js';
import { Settlement } from '../models/Settlement.js';
import { calculateDebts } from './calculationEngine.js';

export async function createExpense(req: Request, res: Response) {
  try {
    const { groupId, description, amount, paidByAddress, participants } = req.body;

    const expense = new Expense({
      groupId,
      description,
      amount,
      paidByAddress,
      participants
    });

    await expense.save();

    // Recalculate settlements
    const expenses = await Expense.find({ groupId });
    const settlements = calculateDebts(expenses);

    // Clear old settlements and create new ones
    await Settlement.deleteMany({ groupId });
    for (const settlement of settlements) {
      const newSettlement = new Settlement({
        groupId,
        fromAddress: settlement.from,
        toAddress: settlement.to,
        amount: settlement.amount,
        isPaid: false
      });
      await newSettlement.save();
    }

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create expense', details: error });
  }
}

export async function getExpenses(req: Request, res: Response) {
  try {
    const { groupId } = req.query;

    const expenses = await Expense.find(
      groupId ? { groupId } : {}
    );

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { description, amount, paidByAddress, participants } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      id,
      { description, amount, paidByAddress, participants },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Recalculate settlements
    const expenses = await Expense.find({ groupId: expense.groupId });
    const settlements = calculateDebts(expenses);

    await Settlement.deleteMany({ groupId: expense.groupId });
    for (const settlement of settlements) {
      const newSettlement = new Settlement({
        groupId: expense.groupId,
        fromAddress: settlement.from,
        toAddress: settlement.to,
        amount: settlement.amount,
        isPaid: false
      });
      await newSettlement.save();
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update expense' });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Recalculate settlements
    const expenses = await Expense.find({ groupId: expense.groupId });
    const settlements = calculateDebts(expenses);

    await Settlement.deleteMany({ groupId: expense.groupId });
    for (const settlement of settlements) {
      const newSettlement = new Settlement({
        groupId: expense.groupId,
        fromAddress: settlement.from,
        toAddress: settlement.to,
        amount: settlement.amount,
        isPaid: false
      });
      await newSettlement.save();
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete expense' });
  }
}
