
import Icon from './Icon';
import { Transaction } from '../types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import React from 'react';

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
    }).format(date);
  };

  const getIconName = () => {
    if (transaction.category?.icon) {
      return transaction.category.icon as keyof typeof Icon;
    }
    return transaction.type === 'income' ? 'trending-up' : 'trending-down';
  };

  const getIconColor = () => {
    if (transaction.category?.color) {
      return transaction.category.color;
    }
    return transaction.type === 'income' ? colors.success : colors.error;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Icon
          name={getIconName()}
          size={24}
          color={getIconColor()}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[
            styles.amount,
            { color: transaction.type === 'income' ? colors.success : colors.error }
          ]}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>

        <View style={styles.secondaryInfo}>
          <Text style={styles.category}>
            {transaction.category?.name || 'Sem categoria'}
          </Text>
          <Text style={styles.date}>
            {formatDate(transaction.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default TransactionItem;
