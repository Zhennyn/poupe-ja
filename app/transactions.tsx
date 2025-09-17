
import { router, Redirect } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import TransactionItem from '../components/TransactionItem';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import SimpleBottomSheet from '../components/BottomSheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Transaction } from '../types';

const TransactionsScreen = () => {
  const { user } = useAuth();
  const { transactions, balance, loading } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

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
      year: 'numeric',
    }).format(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Transações</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Balance Summary */}
      <View style={styles.balanceSummary}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Receitas</Text>
          <Text style={[styles.balanceValue, { color: colors.success }]}>
            {formatCurrency(balance.income)}
          </Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Despesas</Text>
          <Text style={[styles.balanceValue, { color: colors.error }]}>
            {formatCurrency(balance.expenses)}
          </Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={[
            styles.balanceValue,
            { color: balance.total >= 0 ? colors.success : colors.error }
          ]}>
            {formatCurrency(balance.total)}
          </Text>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Carregando transações...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptyStateSubtext}>
              Suas transações aparecerão aqui quando você adicioná-las
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Transaction Details Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      >
        {selectedTransaction && (
          <View style={styles.transactionDetails}>
            <Text style={styles.detailsTitle}>Detalhes da Transação</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo:</Text>
              <Text style={[
                styles.detailValue,
                { color: selectedTransaction.type === 'income' ? colors.success : colors.error }
              ]}>
                {selectedTransaction.type === 'income' ? 'Receita' : 'Despesa'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor:</Text>
              <Text style={[
                styles.detailValue,
                { color: selectedTransaction.type === 'income' ? colors.success : colors.error }
              ]}>
                {formatCurrency(selectedTransaction.amount)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Descrição:</Text>
              <Text style={styles.detailValue}>{selectedTransaction.description}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoria:</Text>
              <Text style={styles.detailValue}>
                {selectedTransaction.category?.name || 'Sem categoria'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data:</Text>
              <Text style={styles.detailValue}>{formatDate(selectedTransaction.date)}</Text>
            </View>
          </View>
        )}
      </SimpleBottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  balanceSummary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionsList: {
    gap: 8,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  transactionDetails: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});

export default TransactionsScreen;
