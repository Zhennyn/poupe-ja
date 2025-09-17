
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTransactions } from '../hooks/useTransactions';
import TransactionItem from '../components/TransactionItem';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';

export default function TransactionsScreen() {
  const { transactions } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    console.log('Transaction selected:', transaction);
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
    }).format(new Date(date));
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>Todas as Transações</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.filterButtonActive]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.filterTextActive]}>
            Receitas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.filterButtonActive]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.filterTextActive]}>
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {sortedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptyStateSubtext}>
              {filter === 'all' 
                ? 'Adicione sua primeira transação'
                : `Nenhuma ${filter === 'income' ? 'receita' : 'despesa'} encontrada`
              }
            </Text>
          </View>
        ) : (
          sortedTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction)}
            />
          ))
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
              <Text style={styles.detailValue}>{selectedTransaction.category}</Text>
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
}

const styles = StyleSheet.create({
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
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: colors.background,
  },
  emptyState: {
    ...commonStyles.card,
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  transactionDetails: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
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
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});
