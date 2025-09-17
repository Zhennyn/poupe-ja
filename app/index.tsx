
import { router, Redirect } from 'expo-router';
import BalanceCard from '../components/BalanceCard';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../hooks/useAuth';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionItem from '../components/TransactionItem';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import SimpleBottomSheet from '../components/BottomSheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Transaction } from '../types';

const MainScreen = () => {
  const { user, signOut } = useAuth();
  const { transactions, balance, addTransaction, categories, loading } = useTransactions();
  const [isAddTransactionVisible, setIsAddTransactionVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const result = await addTransaction(transaction);
    if (result && !result.error) {
      setIsAddTransactionVisible(false);
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleSignOut = async () => {
    await signOut();
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

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá!</Text>
            <Text style={styles.userName}>{user.email}</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
            <Icon name="log-out" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <BalanceCard balance={balance} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => setIsAddTransactionVisible(true)}
          >
            <Icon name="add" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/transactions')}
          >
            <Icon name="list" size={24} color={colors.white} />
            <Text style={styles.actionButtonText}>Ver Todas</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Carregando...</Text>
            </View>
          ) : recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>Nenhuma transação ainda</Text>
              <Text style={styles.emptyStateSubtext}>
                Adicione sua primeira transação para começar
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={isAddTransactionVisible}
        onClose={() => setIsAddTransactionVisible(false)}
      >
        <AddTransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setIsAddTransactionVisible(false)}
          categories={categories}
        />
      </SimpleBottomSheet>

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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
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

export default MainScreen;
