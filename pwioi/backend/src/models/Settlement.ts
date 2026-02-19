import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  txnId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Settlement = mongoose.model('Settlement', settlementSchema);
