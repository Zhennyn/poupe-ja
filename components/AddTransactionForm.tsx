
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { Transaction } from '../types';
import { defaultCategories } from '../data/mockData';
import Icon from './Icon';
import Button from './Button';

interface AddTransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = defaultCategories.filter(cat => cat.type === type);

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory) {
      console.log('Missing required fields');
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.log('Invalid amount');
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      type,
      amount: numericAmount,
      description,
      category: selectedCategory,
      date: new Date(),
    };

    onSubmit(transaction);
    console.log('Transaction submitted:', transaction);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nova Transação</Text>
      
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => {
            setType('income');
            setSelectedCategory('');
          }}
        >
          <Icon name="arrow-up" size={20} color={type === 'income' ? colors.background : colors.success} />
          <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
            Receita
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => {
            setType('expense');
            setSelectedCategory('');
          }}
        >
          <Icon name="arrow-down" size={20} color={type === 'expense' ? colors.background : colors.error} />
          <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
            Despesa
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0,00"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Digite uma descrição"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Icon 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.name ? colors.background : category.color} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.name && styles.categoryButtonTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text="Cancelar"
          onPress={onCancel}
          style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
          textStyle={{ color: colors.primary }}
        />
        <Button
          text="Adicionar"
          onPress={handleSubmit}
          style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
          textStyle={{ color: colors.background }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    ...commonStyles.subtitle,
    textAlign: 'center',
    marginBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: colors.background,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    ...commonStyles.input,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 32,
  },
});

export default AddTransactionForm;
