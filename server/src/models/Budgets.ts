import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  name: { type: String, required: false }
});

const Budget = mongoose.model('budgets', budgetSchema);

export default Budget;
