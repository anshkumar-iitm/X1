import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creatorAddress: { type: String, required: true },
  members: [{
    address: { type: String, required: true },
    name: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Group = mongoose.model('Group', groupSchema);
