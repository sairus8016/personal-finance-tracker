import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'budgets', required: true }
});

const Expense = mongoose.model('expenses', ExpenseSchema);
export default Expense;
