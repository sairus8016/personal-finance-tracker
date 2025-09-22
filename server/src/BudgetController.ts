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
    const { incomeStreams, expenses } = req.body;

    try {
        const budget = await BudgetModel.create({ name: "User Budget" });

        const incomePromises = incomeStreams.map((stream: any) =>
            IncomeModel.create({ ...stream, budgetId: budget._id })
        );
        const expensePromises = expenses.map((expense: any) =>
            ExpenseModel.create({ ...expense, budgetId: budget._id })
        );

        await Promise.all([...incomePromises, ...expensePromises]);

        res.status(201).json({ message: 'Budget saved successfully', budgetId: budget._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving budget data', error });
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

// Generic get budget (for testing)
router.get('/budget', async (req: Request, res: Response) => {
    try {
        const budgets = await BudgetModel.findOne();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budget data', error });
    }
});

export default router;