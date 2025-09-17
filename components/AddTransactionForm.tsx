
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from './Icon';
import { Transaction, Category } from '../types';
import React, { useState } from 'react';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Button from './Button';

interface AddTransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  categories: Category[];
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSubmit, onCancel, categories }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());

  const filteredCategories = categories.filter(category => category.type === type);

  const handleSubmit = () => {
    if (!amount.trim() || !description.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    const transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      type,
      amount: numericAmount,
      description: description.trim(),
      category_id: selectedCategoryId,
      date,
    };

    onSubmit(transaction);
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^\d,.]/g, '');
    return numericValue;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Nova Transação</Text>

      {/* Type Selection */}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'expense' && styles.typeButtonActive,
            type === 'expense' && { backgroundColor: colors.error }
          ]}
          onPress={() => {
            setType('expense');
            setSelectedCategoryId(null);
          }}
        >
          <Icon name="remove" size={20} color={type === 'expense' ? colors.white : colors.error} />
          <Text style={[
            styles.typeButtonText,
            type === 'expense' && styles.typeButtonTextActive
          ]}>
            Despesa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'income' && styles.typeButtonActive,
            type === 'income' && { backgroundColor: colors.success }
          ]}
          onPress={() => {
            setType('income');
            setSelectedCategoryId(null);
          }}
        >
          <Icon name="add" size={20} color={type === 'income' ? colors.white : colors.success} />
          <Text style={[
            styles.typeButtonText,
            type === 'income' && styles.typeButtonTextActive
          ]}>
            Receita
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Valor *</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>R$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0,00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={(text) => setAmount(formatCurrency(text))}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Description Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Almoço no restaurante"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {filteredCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategoryId === category.id && styles.categoryItemActive,
                selectedCategoryId === category.id && { backgroundColor: category.color }
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
            >
              <Icon
                name={category.icon as any}
                size={20}
                color={selectedCategoryId === category.id ? colors.white : category.color}
              />
              <Text style={[
                styles.categoryText,
                selectedCategoryId === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Display */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data</Text>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={20} color={colors.textSecondary} />
          <Text style={styles.dateText}>
            {date.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          text="Cancelar"
          onPress={onCancel}
          style={[styles.button, styles.cancelButton]}
          textStyle={styles.cancelButtonText}
        />
        <Button
          text="Adicionar"
          onPress={handleSubmit}
          style={[styles.button, styles.submitButton]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 8,
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: colors.white,
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
  },
  categoryItemActive: {
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: colors.white,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
});

export default AddTransactionForm;
