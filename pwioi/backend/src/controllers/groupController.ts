import { Request, Response } from 'express';
import { Group } from '../models/Group.js';
import { Expense } from '../models/Expense.js';
import { Settlement } from '../models/Settlement.js';

export async function createGroup(req: Request, res: Response) {
  try {
    const { name, description, creatorAddress, members } = req.body;

    const group = new Group({
      name,
      description,
      creatorAddress,
      members: [{ address: creatorAddress, name: 'Creator' }, ...members]
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create group', details: error });
  }
}

export async function getGroups(req: Request, res: Response) {
  try {
    const { address } = req.query;
    const query = address ? { 'members.address': address } : {};
    const groups = await Group.find(query);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
}

export async function getGroup(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const expenses = await Expense.find({ groupId: id });
    const settlements = await Settlement.find({ groupId: id, isPaid: false });

    res.json({
      group,
      expenses,
      settlements,
      totalExpenses: expenses.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
}

export async function updateGroup(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, members } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      { name, description, members },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update group' });
  }
}

export async function deleteGroup(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await Group.findByIdAndDelete(id);
    await Expense.deleteMany({ groupId: id });
    await Settlement.deleteMany({ groupId: id });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete group' });
  }
}

export async function addMember(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { address, name } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      { $push: { members: { address, name } } },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add member' });
  }
}
