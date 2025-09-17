
import { useState, useEffect, useCallback } from 'react';
import { Transaction, Balance, Category } from '../types';
import { supabase } from '../app/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Balance>({
    total: 0,
    income: 0,
    expenses: 0,
  });

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      const formattedTransactions: Transaction[] = data.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date),
        created_at: new Date(transaction.created_at),
        updated_at: new Date(transaction.updated_at),
        category: transaction.category ? {
          ...transaction.category,
          created_at: new Date(transaction.category.created_at),
          updated_at: new Date(transaction.category.updated_at),
        } : undefined,
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchCategories = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      const formattedCategories: Category[] = data.map(category => ({
        ...category,
        created_at: new Date(category.created_at),
        updated_at: new Date(category.updated_at),
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [user]);

  const calculateBalance = useCallback(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const total = income - expenses;

    setBalance({ total, income, expenses });
  }, [transactions]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
    } else {
      setTransactions([]);
      setCategories([]);
      setBalance({ total: 0, income: 0, expenses: 0 });
      setLoading(false);
    }
  }, [user, fetchTransactions, fetchCategories]);

  useEffect(() => {
    calculateBalance();
  }, [transactions, calculateBalance]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            category_id: transactionData.category_id,
            type: transactionData.type,
            amount: transactionData.amount,
            description: transactionData.description,
            date: transactionData.date.toISOString(),
          },
        ])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        return { error: error.message };
      }

      const newTransaction: Transaction = {
        ...data,
        date: new Date(data.date),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        category: data.category ? {
          ...data.category,
          created_at: new Date(data.category.created_at),
          updated_at: new Date(data.category.updated_at),
        } : undefined,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      console.log('Transaction added successfully:', newTransaction);
      return { data: newTransaction };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { error: 'Erro inesperado ao adicionar transação' };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          category_id: updates.category_id,
          type: updates.type,
          amount: updates.amount,
          description: updates.description,
          date: updates.date?.toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        return { error: error.message };
      }

      const updatedTransaction: Transaction = {
        ...data,
        date: new Date(data.date),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        category: data.category ? {
          ...data.category,
          created_at: new Date(data.category.created_at),
          updated_at: new Date(data.category.updated_at),
        } : undefined,
      };

      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );

      console.log('Transaction updated successfully:', updatedTransaction);
      return { data: updatedTransaction };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { error: 'Erro inesperado ao atualizar transação' };
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting transaction:', error);
        return { error: error.message };
      }

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      console.log('Transaction deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { error: 'Erro inesperado ao deletar transação' };
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            user_id: user.id,
            name: categoryData.name,
            icon: categoryData.icon,
            color: categoryData.color,
            type: categoryData.type,
            is_default: categoryData.is_default,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        return { error: error.message };
      }

      const newCategory: Category = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setCategories(prev => [...prev, newCategory]);
      console.log('Category added successfully:', newCategory);
      return { data: newCategory };
    } catch (error) {
      console.error('Error adding category:', error);
      return { error: 'Erro inesperado ao adicionar categoria' };
    }
  };

  const getRecentTransactions = (limit: number = 5) => {
    return transactions.slice(0, limit);
  };

  const getTransactionsByMonth = (month: number, year: number) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    });
  };

  return {
    transactions,
    categories,
    balance,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    getRecentTransactions,
    getTransactionsByMonth,
    fetchTransactions,
    fetchCategories,
  };
};
