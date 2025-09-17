import React from 'react';
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
  incomeStreams: IncomeStreamProps[];
  expenses: ExpenseProps[];
};

const Budget: React.FC<BudgetProps> = ({ incomeStreams, expenses }) => {
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
        </tbody>
      </table>

      {/* Total Income: $4000/month<br />
      Total Expenses: $2180/month<br />
      Net Savings: $1820/month<br /> */}
    </div>
  );
};

export default Budget;
