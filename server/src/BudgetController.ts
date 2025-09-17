import { Router, Request, Response } from 'express';

const router = Router();

interface IncomeStreamProps {
  key: number;
  name: string;
  frequency: number;
  amount: number;
}

interface Expenses {
  key: number;
  name: string;
  amount: number;
}

interface Budget {
    incomeStreams: IncomeStreamProps[];
    expenses: Expenses[];
}

function getBudget(): Budget {
    const incomeStreams: IncomeStreamProps[] = [
        {
            key: 1,
            name: "Paycheck",
            frequency: 2,
            amount: 2000
        }
    ];

    const expenses: Expenses[] = [
        {
            key: 1,
            name: "Mortgage",
            amount: 1300
        },
        {
            key: 2,
            name: "Phone",
            amount: 120
        },
        {
            key: 3,
            name: "Internet",
            amount: 60
        },
        {
            key: 4,
            name: "Groceries",
            amount: 300
        },
        {
            key: 5,
            name: "Gas",
            amount: 100
        },
        {
            key: 6,
            name: "Entertainment",
            amount: 100
        },
        {
            key: 7,
            name: "Savings",
            amount: 200
        }
    ];

    return { incomeStreams, expenses };
}

router.get('/BudgetController', (req: Request, res: Response) => {
    const budget = getBudget();
    res.json(budget);
});

export default router;