import { Router, Request, Response } from 'express';
import BudgetModel from './models/Budgets';
import IncomeModel from './models/incomeStream';
import ExpenseModel from './models/expense';

const router = Router();

// Initialize budget with some data
// router.post('/init', async (req: Request, res: Response) => {
//     const budget = await BudgetModel.create({ name: "Default Budget" });
//     console.log('IncomeStream model:', IncomeModel);
//     console.log('Expense model:', ExpenseModel);
//     await IncomeModel.create([
//         { budgetId: budget._id, name: 'Salary', frequency: 1, amount: 5000 },
//         { budgetId: budget._id, name: 'Freelance', frequency: 2, amount: 1500 }
//     ]);

//     await ExpenseModel.create([
//         { budgetId: budget._id, name: 'Rent', amount: 1200 },
//         { budgetId: budget._id, name: 'Groceries', amount: 300 },
//         { budgetId: budget._id, name: 'Utilities', amount: 150 }
//     ]);

//     console.log('Budget with data created.');
// });

// POST save budget data
router.post('/saveBudget', async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Budget name required."});

    try {
        const newBudget = new BudgetModel({
          name,
          incomeStreams: [],
          expenses: [],
        });

        const saved = await newBudget.save();

        res.json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create budget data', error });
    }
});
// router.post('/saveBudget', async (req: Request, res: Response) => {
//     const { incomeStreams, expenses } = req.body;

//     try {
//         const budget = await BudgetModel.create({ name: "User Budget" });

//         const incomePromises = incomeStreams.map((stream: any) =>
//             IncomeModel.create({ ...stream, budgetId: budget._id })
//         );
//         const expensePromises = expenses.map((expense: any) =>
//             ExpenseModel.create({ ...expense, budgetId: budget._id })
//         );

//         await Promise.all([...incomePromises, ...expensePromises]);

//         res.status(201).json({ message: 'Budget saved successfully', budgetId: budget._id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error saving budget data', error });
//     }
// });

// GET all budgets
router.get('/budget/', async(req: Request, res: Response) => {
  try {
    const budgets = await BudgetModel.find({});
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets."});
  }
});

// GET budget by ID along with its income streams and expenses
router.get('/budget/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const incomeStreams = await IncomeModel.find({ budgetId: id });
    const expenses = await ExpenseModel.find({ budgetId: id });

    res.json({ incomeStreams, expenses });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/incomes
router.post("/incomes", async (req, res) => {
  try {
    const { name, amount, frequency, budgetId } = req.body;

    if (!name || !budgetId) {
      return res.status(400).json({ message: "Name and budgetId are required" });
    }

    const income = new IncomeModel({ name, amount, frequency, budgetId });
    const savedIncome = await income.save();

    res.status(201).json(savedIncome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/incomeDelete
router.post("/incomeDelete", async (req, res) => {
  try {
    const { incomeId } = req.body;

    if (!incomeId) {
      return res.status(400).json({ message: "Missing incomeId" });
    }

    const deletedIncome = await IncomeModel.findByIdAndDelete(incomeId);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income deleted", deletedIncome });
  } catch (err) {
    console.error("Error deleting income:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/expenses
router.post("/expenses", async (req, res) => {
  try {
    const { name, amount, budgetId } = req.body;

    if (!name || !budgetId) {
      return res.status(400).json({ message: "Name and budgetId are required" });
    }

    const expense = new ExpenseModel({ name, amount, budgetId });
    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/expenseDelete
router.post("/expenseDelete", async (req, res) => {
  try {
    const { expenseId } = req.body;

    if (!expenseId) {
      return res.status(400).json({ message: "Missing expenseId" });
    }

    const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted", deletedExpense });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;