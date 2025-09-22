import React, { useState } from 'react';
import './Budget.css';

type IncomeStreamProps = {
  name: string;
  amount: number;
  frequency: number;
};

const IncomeStream: React.FC<IncomeStreamProps> = ({ name, amount, frequency }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>${amount}</td>
      <td>{frequency}</td>
    </tr>
  );
};

type ExpenseProps = {
  name: string;
  amount: number;
};

const Expense: React.FC<ExpenseProps> = ({ name, amount }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>${amount}</td>
    </tr>
  );
};

type BudgetProps = {
  budgetId: string;
  incomeStreams: IncomeStreamProps[];
  expenses: ExpenseProps[];
  onExpenseAdded?: () => void; // optional callback to refresh the list after adding
};

const Budget: React.FC<BudgetProps> = ({ budgetId, incomeStreams, expenses, onExpenseAdded }) => {

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseValue, setNewExpenseValue] = useState("");

  // change handler for textbox
  function changeNewExpenseName(e: React.ChangeEvent<HTMLInputElement>) {
    setNewExpenseName(e.target.value);
  }
  function changeNewExpenseValue(e: React.ChangeEvent<HTMLInputElement>) {
    setNewExpenseValue(e.target.value);
  }

  // submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newExpenseName.trim()) return;

    try {
      const response = await fetch(`/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newExpenseName,
          amount: 0, // you can extend this later for user input
          budgetId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create expense");

      setNewExpenseName(""); // clear textbox
      if (onExpenseAdded) onExpenseAdded(); // let parent refresh expense list
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="Budget">
      <h1>Budget</h1>

      <div>
        <h2>Income Streams:</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {incomeStreams.map((stream, index) => (
              <IncomeStream key={index} {...stream} />
            ))}
          </tbody>
        </table>
      </div>

      <h2>Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <Expense key={index} {...expense} />
          ))}
          <tr>
            <td>
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="New expense name"
                  value={newExpenseName}
                  onChange={changeNewExpenseName}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  placeholder="New expense value"
                  value={newExpenseValue}
                  onChange={changeNewExpenseValue}
                  className="border rounded px-2 py-1"
                />
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                  Add Expense
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Total Income: $4000/month<br />
      Total Expenses: $2180/month<br />
      Net Savings: $1820/month<br /> */}
    </div>
  );
};

export default Budget;
