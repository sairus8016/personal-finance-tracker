import React, { useState } from 'react';
import './Budget.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

type IncomeStreamProps = {
  _id: string;
  name: string;
  amount: number;
  frequency: number;
  onRefresh?: () => void; // optional callback to refresh the list after adding
};

const IncomeStream: React.FC<IncomeStreamProps> = ({ _id, name, amount, frequency, onRefresh }) => {
  // delete handler
  async function handleDelete(incomeId: string, onRefresh?: () => void) {

    try {
      const response = await fetch(`http://localhost:5001/api/incomeDelete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incomeId,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete income");

      console.log("Income deleted");

      if (onRefresh) onRefresh(); // let parent refresh income list
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <tr>
      <td>{name}</td>
      <td>${amount}</td>
      <td>{frequency}</td>
      <td>
        <Button variant="outlined" color="error" onClick={() => handleDelete(_id, onRefresh)} className="bg-blue-500 text-white px-3 py-1 rounded">
          Delete Income
        </Button>
      </td>
    </tr>
  );
};

type ExpenseProps = {
  _id: string;
  name: string;
  amount: number;
  onRefresh?: () => void; // optional callback to refresh the list after deleting
};

const Expense: React.FC<ExpenseProps> = ({ _id, name, amount, onRefresh }) => {
  // delete handler
  async function handleDelete(expenseId: string, onRefresh?: () => void) {

    try {
      const response = await fetch(`http://localhost:5001/api/expenseDelete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenseId,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      console.log("Expense deleted");

      if (onRefresh) onRefresh(); // let parent refresh expense list
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <tr>
      <td>{name}</td>
      <td>${amount}</td>
      <td>
        <Button variant="outlined" color="error" onClick={() => handleDelete(_id, onRefresh)} className="bg-blue-500 text-white px-3 py-1 rounded">
          Delete Expense
        </Button>
      </td>
      
    </tr>
  );
};

type BudgetProps = {
  budgetId: string;
  incomeStreams: IncomeStreamProps[];
  expenses: ExpenseProps[];
  onRefresh?: () => void; // optional callback to refresh the list after adding
};

const Budget: React.FC<BudgetProps> = ({ budgetId, incomeStreams, expenses, onRefresh }) => {

  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeValue, setNewIncomeValue] = useState("");
  const [newFrequencyValue, setNewFrequencyValue] = useState(1); // default to monthly
  
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseValue, setNewExpenseValue] = useState("");

  // change handler for textbox
  function changeNewIncomeName(e: React.ChangeEvent<HTMLInputElement>) {
    setNewIncomeName(e.target.value);
  }
  function changeNewIncomeValue(e: React.ChangeEvent<HTMLInputElement>) {
    setNewIncomeValue(e.target.value);
  }
  function changeNewFrequencyValue(e: React.ChangeEvent<HTMLInputElement>) {
    setNewFrequencyValue(Number(e.target.value));
  }
  function changeNewExpenseName(e: React.ChangeEvent<HTMLInputElement>) {
    setNewExpenseName(e.target.value);
  }
  function changeNewExpenseValue(e: React.ChangeEvent<HTMLInputElement>) {
    setNewExpenseValue(e.target.value);
  }

  // submit handler
  async function handleIncomeSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newIncomeName.trim()) return;

    try {
      const response = await fetch(`http://localhost:5001/api/incomes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newIncomeName,
          amount: newIncomeValue, // you can extend this later for user input
          frequency: newFrequencyValue,
          budgetId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create income");

      setNewIncomeName(""); setNewIncomeValue(""); setNewFrequencyValue(0);// clear textboxes
      if (onRefresh) onRefresh(); // let parent refresh income list
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newExpenseName.trim()) return;

    try {
      const response = await fetch(`http://localhost:5001/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newExpenseName,
          amount: newExpenseValue, // you can extend this later for user input
          budgetId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create expense");

      setNewExpenseName(""); setNewExpenseValue(""); // clear textboxes
      if (onRefresh) onRefresh(); // let parent refresh expense list
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="Budget">
      <form>  {/*later add onSubmit handler*/}
        {/* <InputLabel id="simple-select-label">Select Budget</InputLabel> */}
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={budgetId}
          // onChange={handleChange}
          label="Select Budget"
        >
          <MenuItem value={"68cdf096c35077c8f92b1f98"}>Ben's Budget</MenuItem>
        </Select>
        <Button variant="contained" type="submit" value="Go">Go</Button>
      </form>
      <h1>Monthly Budget</h1>

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
              <IncomeStream key={index} {...stream} onRefresh={onRefresh}/>
            ))}
          </tbody>
        </table>
        <form onSubmit={handleIncomeSubmit} className="flex gap-2 items-center">
          <TextField
            variant="outlined"
            size="small"
            type="text"
            placeholder="New income name"
            value={newIncomeName}
            onChange={changeNewIncomeName}
            className="border rounded px-2 py-1"
          />
          <TextField
            variant="outlined"
            size="small"
            type="text"
            placeholder="New income value"
            value={newIncomeValue}
            onChange={changeNewIncomeValue}
            className="border rounded px-2 py-1"
          />
          <TextField
            variant="outlined"
            size="small"
            type="text"
            placeholder="New frequency value"
            value={newFrequencyValue}
            onChange={changeNewFrequencyValue}
            className="border rounded px-2 py-1"
          />
          <Button variant="contained" color="success" type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
            Add Income
          </Button>
        </form>
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
            <Expense key={index} {...expense} onRefresh={onRefresh}/>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="New expense name"
          value={newExpenseName}
          onChange={changeNewExpenseName}
          className="border rounded px-2 py-1"
        />
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="New expense value"
          value={newExpenseValue}
          onChange={changeNewExpenseValue}
          className="border rounded px-2 py-1"
        />
        <Button variant="contained" color="success" type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Add Expense
        </Button>
      </form>
      {/* Total Income: $4000/month<br />
      Total Expenses: $2180/month<br />
      Net Savings: $1820/month<br /> */}
    </div>
  );
};

export default Budget;
