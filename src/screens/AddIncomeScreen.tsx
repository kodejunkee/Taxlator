import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Currency } from '../types/income';
import { convertToNGN } from '../utils/currencyConverter';
import { getCurrencySymbol, formatInputAmount, parseFormattedAmount } from '../utils/formatters';

import { CurrencySelector } from '../components/CurrencySelector';
import { CurrencyModal } from '../components/CurrencyModal';
import { CustomAlert } from '../components/common/CustomAlert';

const CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR']; // Keep for something? Actually, I'll remove it.

export const AddIncomeScreen = () => {
  const navigation = useNavigation();
  const { addIncome, settings, updateSettings, playClickSound } = useAppContext();
  const { colors } = useTheme();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<Currency>(settings.preferredCurrency || 'NGN');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectCurrency = (code: string) => {
    setCurrency(code);
    if (code !== 'NGN') {
      updateSettings({ preferredCurrency: code });
    }
  };

  const handleSave = () => {
    playClickSound();
    const numAmount = parseFormattedAmount(amount);
    if (!numAmount || numAmount <= 0) {
      setIsErrorVisible(true);
      return;
    }

    const amountNGN = convertToNGN(numAmount, currency, settings.exchangeRates);

    addIncome({
      id: Date.now().toString(),
      amount: numAmount,
      currency,
      amountNGN,
      description: description.trim() || 'Income',
      date: new Date().toISOString(),
    });

    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary, marginBottom: SIZES.small }]}>Amount</Text>
        <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
          <CurrencySelector
            currencyCode={currency}
            onPress={() => {
              setIsModalVisible(true);
            }}
            style={styles.selector}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={(text) => setAmount(formatInputAmount(text))}
            autoFocus
          />
        </View>

        <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary, marginBottom: SIZES.small, marginTop: SIZES.xlarge }]}>Description</Text>
        <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
          <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} style={{ marginRight: SIZES.small }} />
          <TextInput
            style={[styles.inputSmall, { color: colors.text }]}
            placeholder="e.g. Freelance project, Salary"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 300 }}
        >
          <TouchableOpacity onPress={handleSave} activeOpacity={0.8} style={styles.saveBtnContainer}>
            <LinearGradient
              colors={[colors.primary, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveBtn, SHADOWS.glow]}
            >
              <Text style={[TYPOGRAPHY.bodyMedium, { color: '#ffffff' }]}>Add Income</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
      <CustomAlert
        visible={isErrorVisible}
        title="Invalid Amount"
        message="Please enter a valid amount before saving."
        confirmText="Got it"
        onConfirm={() => setIsErrorVisible(false)}
      />

      <CurrencyModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedCurrency={currency}
        onSelect={handleSelectCurrency}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.large,
  },
  card: {
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    ...SHADOWS.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    marginRight: 4,
  },
  selector: {
    marginRight: 4,
    marginTop: 12,
  },
  input: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    flex: 1,
  },
  inputSmall: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    flex: 1,
    paddingVertical: SIZES.small,
  },
  saveBtnContainer: {
    marginTop: SIZES.xxlarge,
  },
  saveBtn: {
    paddingVertical: SIZES.medium,
    borderRadius: 16,
    alignItems: 'center',
  },
});
