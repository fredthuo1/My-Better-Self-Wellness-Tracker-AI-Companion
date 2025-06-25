import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Plus, TrendingDown, TrendingUp, Calendar, X } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';

export default function FinanceLog() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');

  const categories = [
    { id: 'gym', label: 'Gym & Fitness', icon: '🏋️', color: '#10b981' },
    { id: 'supplements', label: 'Supplements', icon: '💊', color: '#f59e0b' },
    { id: 'therapy', label: 'Therapy', icon: '🧠', color: '#8b5cf6' },
    { id: 'wellness', label: 'Wellness', icon: '🧘', color: '#14b8a6' },
    { id: 'medical', label: 'Medical', icon: '⚕️', color: '#ef4444' },
    { id: 'other', label: 'Other', icon: '📝', color: '#64748b' },
  ];

  const monthlyStats = {
    totalExpenses: 485.50,
    totalIncome: 120.00,
    netSpending: 365.50,
    budgetUsed: 68,
  };

  const recentTransactions = [
    { id: '1', date: 'Today', description: 'Gym membership', amount: -45.00, category: 'gym', type: 'expense' },
    { id: '2', date: 'Yesterday', description: 'Protein powder', amount: -35.99, category: 'supplements', type: 'expense' },
    { id: '3', date: '2 days ago', description: 'Therapy session', amount: -100.00, category: 'therapy', type: 'expense' },
    { id: '4', date: '3 days ago', description: 'Wellness coaching', amount: 120.00, category: 'wellness', type: 'income' },
    { id: '5', date: '4 days ago', description: 'Yoga class', amount: -25.00, category: 'wellness', type: 'expense' },
  ];

  const handleSaveTransaction = () => {
    const transaction = {
      amount: selectedType === 'expense' ? -parseFloat(amount) : parseFloat(amount),
      description,
      category: selectedCategory,
      type: selectedType,
      date: new Date().toISOString(),
    };
    console.log('Saving transaction:', transaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setSelectedType('expense');
    setIsModalVisible(false);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Finance Tracker</Text>
          <Text style={styles.subtitle}>Track your wellness spending</Text>
        </View>

        {/* Monthly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Expenses"
              value={`$${monthlyStats.totalExpenses.toFixed(2)}`}
              subtitle="Total spent"
              icon={<TrendingDown size={20} color="#ef4444" />}
              color="#ef4444"
            />
            <StatCard
              title="Income"
              value={`$${monthlyStats.totalIncome.toFixed(2)}`}
              subtitle="Wellness income"
              icon={<TrendingUp size={20} color="#10b981" />}
              color="#10b981"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Net Spending"
              value={`$${monthlyStats.netSpending.toFixed(2)}`}
              subtitle="After income"
              icon={<DollarSign size={20} color="#f59e0b" />}
              color="#f59e0b"
            />
            <StatCard
              title="Budget Used"
              value={`${monthlyStats.budgetUsed}%`}
              subtitle="Of monthly budget"
              icon={<Calendar size={20} color="#8b5cf6" />}
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Quick Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Plus size={24} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>

        {/* Categories Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories This Month</Text>
          <Card>
            {categories.map((category) => {
              const spent = recentTransactions
                .filter(t => t.category === category.id && t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
              
              return (
                <View key={category.id} style={styles.categoryRow}>
                  <View style={styles.categoryLeft}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.label}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>
                    ${spent.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </Card>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Card>
            {recentTransactions.map((transaction, index) => {
              const categoryInfo = getCategoryInfo(transaction.category);
              return (
                <View key={transaction.id}>
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionLeft}>
                      <Text style={styles.transactionIcon}>{categoryInfo.icon}</Text>
                      <View style={styles.transactionContent}>
                        <Text style={styles.transactionDescription}>
                          {transaction.description}
                        </Text>
                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.amount > 0 ? '#10b981' : '#ef4444' }
                    ]}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                  </View>
                  {index < recentTransactions.length - 1 && <View style={styles.separator} />}
                </View>
              );
            })}
          </Card>
        </View>

        {/* Budget Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💰 Budget Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>• Set a monthly wellness budget and stick to it</Text>
            <Text style={styles.tip}>• Look for gym deals and membership discounts</Text>
            <Text style={styles.tip}>• Consider bulk buying supplements for savings</Text>
            <Text style={styles.tip}>• Track spending to identify unnecessary expenses</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Transaction Type */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, selectedType === 'expense' && styles.selectedType]}
                onPress={() => setSelectedType('expense')}
              >
                <Text style={[styles.typeText, selectedType === 'expense' && styles.selectedTypeText]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, selectedType === 'income' && styles.selectedType]}
                onPress={() => setSelectedType('income')}
              >
                <Text style={[styles.typeText, selectedType === 'income' && styles.selectedTypeText]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      selectedCategory === category.id && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
                    <Text style={styles.categoryOptionText}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="What was this for?"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <Button
              title="Save Transaction"
              onPress={handleSaveTransaction}
              disabled={!amount || !selectedCategory || !description}
              style={styles.saveButton}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#14b8a6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
  },
  categoryAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ef4444',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  transactionAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  tipsCard: {
    backgroundColor: '#fef7ff',
    borderColor: '#f3e8ff',
    borderWidth: 1,
    marginBottom: 32,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7c3aed',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7c3aed',
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748b',
  },
  selectedTypeText: {
    color: '#1e293b',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#ecfdf5',
    borderColor: '#14b8a6',
  },
  categoryOptionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 40,
  },
});