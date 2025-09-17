
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Transaction } from '../types';
import Icon from './Icon';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(date));
  };

  const getIconName = () => {
    switch (transaction.category) {
      case 'Salário': return 'wallet';
      case 'Freelance': return 'laptop';
      case 'Investimentos': return 'trending-up';
      case 'Alimentação': return 'restaurant';
      case 'Transporte': return 'car';
      case 'Moradia': return 'home';
      case 'Saúde': return 'medical';
      case 'Educação': return 'school';
      case 'Lazer': return 'game-controller';
      default: return transaction.type === 'income' ? 'add-circle' : 'remove-circle';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon 
          name={getIconName()} 
          size={24} 
          color={transaction.type === 'income' ? colors.success : colors.error} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={[
          styles.amount, 
          { color: transaction.type === 'income' ? colors.success : colors.error }
        ]}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default TransactionItem;
