
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Balance } from '../types';
import Icon from './Icon';

interface BalanceCardProps {
  balance: Balance;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.totalBalance}>
        <Text style={styles.totalLabel}>Saldo Total</Text>
        <Text style={[styles.totalAmount, { color: balance.total >= 0 ? colors.success : colors.error }]}>
          {formatCurrency(balance.total)}
        </Text>
      </View>
      
      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <View style={styles.iconContainer}>
            <Icon name="arrow-up" size={20} color={colors.success} />
          </View>
          <View>
            <Text style={styles.breakdownLabel}>Receitas</Text>
            <Text style={[styles.breakdownAmount, { color: colors.success }]}>
              {formatCurrency(balance.income)}
            </Text>
          </View>
        </View>
        
        <View style={styles.breakdownItem}>
          <View style={styles.iconContainer}>
            <Icon name="arrow-down" size={20} color={colors.error} />
          </View>
          <View>
            <Text style={styles.breakdownLabel}>Despesas</Text>
            <Text style={[styles.breakdownAmount, { color: colors.error }]}>
              {formatCurrency(balance.expenses)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.card,
    marginBottom: 20,
  },
  totalBalance: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BalanceCard;
