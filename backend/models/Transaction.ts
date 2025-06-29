import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Revenue', 'Expense']
  },
  status: {
    type: String,
    required: true,
    enum: ['Paid', 'Pending', 'Failed', 'Cancelled']
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  user_profile: {
    type: String,
    default: 'https://thispersondoesnotexist.com/'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ user_id: 1, date: -1 });
transactionSchema.index({ category: 1, date: -1 });
transactionSchema.index({ status: 1 });

// Virtual for transaction type based on amount
transactionSchema.virtual('type').get(function(this: any) {
  return this.amount >= 0 ? 'income' : 'expense';
});

// Method to get formatted amount
transactionSchema.methods.getFormattedAmount = function() {
  return Math.abs(this.amount).toFixed(2);
};

export default mongoose.model('Transaction', transactionSchema); 