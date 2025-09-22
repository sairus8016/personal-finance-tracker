import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'budgets', required: true },
  name: { type: String, required: true },
  frequency: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const IncomeStream = mongoose.model('incomestreams', incomeSchema);

export default IncomeStream;
