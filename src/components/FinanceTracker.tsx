'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Currency options
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' }
];

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

interface FinanceData {
  initialBalance: number | null;
  transactions: Transaction[];
  currency: string;
}

const EXPENSE_CATEGORIES = [
  'Food', 'Groceries','Transportation', 'Fuel', 'Housing', 'Utilities','Health Insurance', 'Car Insurance',
  'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Memberships','Investments', 'Loan', 'Gift/Donations','Travel' ,'Other'
];

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 'Business', 'Other'
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7F50', '#9467BD', '#E377C2'];

const STORAGE_KEY = 'finance_tracker_v2';

const DATE_RANGES = [
  { label: 'Last Day', value: '1' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 3 Months', value: '90' },
  { label: 'Last 6 Months', value: '180' },
  { label: 'Last Year', value: '365' },
  { label: 'All Time', value: 'all' }
];

const formatCurrency = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const FinanceTracker: React.FC = () => {
  const [financeData, setFinanceData] = useState<FinanceData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            currency: parsed.currency || 'USD'
          };
        } catch (e) {
          console.error('Error parsing saved data:', e);
        }
      }
    }
    return {
      initialBalance: null,
      transactions: [],
      currency: 'USD'
    };
  });

  const [tempInitialBalance, setTempInitialBalance] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined' && financeData.initialBalance !== null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(financeData));
    }
  }, [financeData]);

  const handleCurrencyChange = (newCurrency: string) => {
    setFinanceData(prev => ({
      ...prev,
      currency: newCurrency
    }));
  };

  const getFilteredTransactionsByDate = (transactions: Transaction[]) => {
    if (dateRange === 'all') {
      return transactions;
    }

    const now = new Date();
    const cutoffDate = new Date();
    const days = parseInt(dateRange);
    cutoffDate.setDate(now.getDate() - days);

    return transactions.filter(transaction => 
      new Date(transaction.date) >= cutoffDate
    );
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all financial data? This cannot be undone.')) {
      setFinanceData({
        initialBalance: null,
        transactions: [],
        currency: 'USD'
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleInitialBalance = () => {
    const amount = parseFloat(tempInitialBalance);
    if (!isNaN(amount)) {
      setFinanceData(prev => ({
        ...prev,
        initialBalance: amount
      }));
      setTempInitialBalance('');
    }
  };

  const addTransaction = () => {
    if (!newAmount || !selectedCategory) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(newAmount),
      category: selectedCategory,
      date: new Date().toISOString()
    };

    setFinanceData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));

    setNewAmount('');
    setSelectedCategory('');
  };

  const getCurrentBalance = () => {
    const initial = financeData.initialBalance || 0;
    const filteredTransactions = getFilteredTransactionsByDate(financeData.transactions);
    const transactionSum = filteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
    return initial + transactionSum;
  };

  const getTotals = () => {
    const filteredTransactions = getFilteredTransactionsByDate(financeData.transactions);
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  };

  const getExpensesByCategory = () => {
    const filteredTransactions = getFilteredTransactionsByDate(financeData.transactions);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expenses).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  const getTrendData = () => {
    const filteredTransactions = getFilteredTransactionsByDate(financeData.transactions);
    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    filteredTransactions.forEach(transaction => {
      const monthYear = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expenses: 0 };
      }

      if (transaction.type === 'income') {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expenses += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, data]) => ({
        date,
        ...data
      }));
  };

  const getSavingsData = () => {
    const filteredTransactions = getFilteredTransactionsByDate(financeData.transactions);
    let runningTotal = financeData.initialBalance || 0;
    const monthlyData: Record<string, number> = {};

    const sortedTransactions = [...filteredTransactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTransactions.forEach(transaction => {
      const monthYear = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      runningTotal += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      monthlyData[monthYear] = runningTotal;
    });

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, amount]) => ({
        date,
        savings: amount
      }));
  };

  const getAverages = () => {
    const filteredTransactions = getFilteredTransactionsByDate(financeData.transactions);
    const months = new Set(
      filteredTransactions.map(t => 
        new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' })
      )
    );

    const totals = getTotals();
    const monthCount = Math.max(months.size, 1);

    return {
      avgIncome: totals.income / monthCount,
      avgExpenses: totals.expenses / monthCount
    };
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Time Range:</span>
            <select
              onChange={(e) => setDateRange(e.target.value)}
              value={dateRange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {DATE_RANGES.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Currency:</span>
            <select
              value={financeData.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={resetData}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reset All Data
        </button>
      </div>

      {financeData.initialBalance === null && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Set Initial Balance</h2>
          <div className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Enter initial balance"
              value={tempInitialBalance}
              className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onChange={(e) => setTempInitialBalance(e.target.value)}
            />
            <button
              onClick={handleInitialBalance}
              className="w-full max-w-xs px-4 py-2 bg-[#0B4371] text-white rounded-lg hover:bg-[#052640] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirm Initial Balance
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Balance</h2>
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(getCurrentBalance(), financeData.currency)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Income</h2>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(getTotals().income, financeData.currency)}
          </div>
        </div>

        <div className="bg-red-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Expenses</h2>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(getTotals().expenses, financeData.currency)}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Transaction</h2>
          <div className="space-y-4">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {(transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <button
              onClick={addTransaction}
              className="w-full px-4 py-2 bg-[#0B4371] text-white rounded-lg hover:bg-[#052640] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add {transactionType}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="space-y-2 text-gray-700">
            <p className="flex justify-between">
              <span>Total Income:</span>
              <span className="font-medium text-green-600">{formatCurrency(getTotals().income, financeData.currency)}</span>
            </p>
            <p className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-medium text-red-600">{formatCurrency(getTotals().expenses, financeData.currency)}</span>
            </p>
            <p className="flex justify-between">
              <span>Average Monthly Income:</span>
              <span className="font-medium text-green-600">{formatCurrency(getAverages().avgIncome, financeData.currency)}</span>
            </p>
            <p className="flex justify-between">
              <span>Average Monthly Expenses:</span>
              <span className="font-medium text-red-600">{formatCurrency(getAverages().avgExpenses, financeData.currency)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Income vs Expenses Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value, financeData.currency)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value, financeData.currency), '']}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getExpensesByCategory()}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => formatCurrency(value, financeData.currency)}
                >
                  {getExpensesByCategory().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), financeData.currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Savings Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getSavingsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value, financeData.currency)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value, financeData.currency), '']}
                />
                <Line type="monotone" dataKey="savings" stroke="#6366F1" name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Averages</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[getAverages()]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis tickFormatter={(value) => formatCurrency(value, financeData.currency)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value, financeData.currency), '']}
                />
                <Legend />
                <Bar dataKey="avgIncome" name="Avg Income" fill="#10B981" />
                <Bar dataKey="avgExpenses" name="Avg Expenses" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium">Date</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Type</th>
                <th className="px-6 py-3 text-gray-500 font-medium">Category</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredTransactionsByDate(financeData.transactions)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{transaction.category}</td>
                    <td className={`px-6 py-4 text-right ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.amount, financeData.currency)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {getFilteredTransactionsByDate(financeData.transactions).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected time range
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinanceTracker;