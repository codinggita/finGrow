import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Stock', 'Crypto', 'Mutual Fund', 'Gold', 'Real Estate', 'Other'],
    default: 'Stock'
  },
  quantity: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number
  }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
