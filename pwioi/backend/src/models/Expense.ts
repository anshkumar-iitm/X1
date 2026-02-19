import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidByAddress: { type: String, required: true },
  participants: [{
    address: { type: String, required: true },
    share: { type: Number, required: true }
  }],
  currency: { type: String, default: 'ALGO' },
  createdAt: { type: Date, default: Date.now }
});

export const Expense = mongoose.model('Expense', expenseSchema);
