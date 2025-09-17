
import { useState, useEffect } from 'react';
import { Transaction, Balance } from '../types';
import { mockTransactions } from '../data/mockData';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [balance, setBalance] = useState<Balance>({ total: 0, income: 0, expenses: 0 });

  const calculateBalance = (transactionList: Transaction[]): Balance => {
    const income = transactionList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactionList
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      total: income - expenses,
    };
  };

  useEffect(() => {
    const newBalance = calculateBalance(transactions);
    setBalance(newBalance);
    console.log('Balance updated:', newBalance);
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    console.log('Transaction added:', newTransaction);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    console.log('Transaction removed:', id);
  };

  const getRecentTransactions = (limit: number = 5) => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getTransactionsByType = (type: 'income' | 'expense') => {
    return transactions.filter(t => t.type === type);
  };

  return {
    transactions,
    balance,
    addTransaction,
    removeTransaction,
    getRecentTransactions,
    getTransactionsByType,
  };
};
