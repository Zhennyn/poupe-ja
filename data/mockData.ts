
import { Transaction, Category } from '../types';

export const defaultCategories: Category[] = [
  // Receitas
  { id: '1', name: 'Salário', icon: 'wallet', color: '#4CAF50', type: 'income' },
  { id: '2', name: 'Freelance', icon: 'laptop', color: '#2196F3', type: 'income' },
  { id: '3', name: 'Investimentos', icon: 'trending-up', color: '#FF9800', type: 'income' },
  { id: '4', name: 'Outros', icon: 'add-circle', color: '#9C27B0', type: 'income' },
  
  // Despesas
  { id: '5', name: 'Alimentação', icon: 'restaurant', color: '#F44336', type: 'expense' },
  { id: '6', name: 'Transporte', icon: 'car', color: '#E91E63', type: 'expense' },
  { id: '7', name: 'Moradia', icon: 'home', color: '#9C27B0', type: 'expense' },
  { id: '8', name: 'Saúde', icon: 'medical', color: '#FF5722', type: 'expense' },
  { id: '9', name: 'Educação', icon: 'school', color: '#795548', type: 'expense' },
  { id: '10', name: 'Lazer', icon: 'game-controller', color: '#607D8B', type: 'expense' },
  { id: '11', name: 'Outros', icon: 'remove-circle', color: '#757575', type: 'expense' },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Salário Janeiro',
    category: 'Salário',
    date: new Date('2024-01-01'),
  },
  {
    id: '2',
    type: 'expense',
    amount: 800,
    description: 'Supermercado',
    category: 'Alimentação',
    date: new Date('2024-01-02'),
  },
  {
    id: '3',
    type: 'expense',
    amount: 1200,
    description: 'Aluguel',
    category: 'Moradia',
    date: new Date('2024-01-03'),
  },
  {
    id: '4',
    type: 'income',
    amount: 1500,
    description: 'Projeto Freelance',
    category: 'Freelance',
    date: new Date('2024-01-05'),
  },
  {
    id: '5',
    type: 'expense',
    amount: 300,
    description: 'Combustível',
    category: 'Transporte',
    date: new Date('2024-01-07'),
  },
];
