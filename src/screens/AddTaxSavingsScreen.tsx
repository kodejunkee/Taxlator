import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { TaxProgressBar } from '../components/TaxProgressBar';
import { calculateNigeriaTax } from '../utils/taxCalculator';

import { CustomAlert } from '../components/common/CustomAlert';

export const AddTaxSavingsScreen = () => {
  const navigation = useNavigation();
  const { incomes, savings, addSaving } = useAppContext();
  const { colors } = useTheme();
  
  const [amount, setAmount] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const totalGrossNGN = incomes.reduce((sum, item) => sum + item.amountNGN, 0);
  const taxResults = calculateNigeriaTax(totalGrossNGN);
  const totalSaved = savings.reduce((sum, item) => sum + item.amount, 0);

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setIsErrorVisible(true);
      return;
    }

    addSaving({
      amount: numAmount,
      date: new Date().toISOString(),
    });

    setAmount('');
    setIsSuccessVisible(true);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <TaxProgressBar saved={totalSaved} target={taxResults.tax} />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary, marginBottom: SIZES.small }]}>
          Savings Amount (NGN)
        </Text>
        <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
          <Text style={[styles.currencySymbol, { color: colors.text }]}>₦</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 500 }}
        >
          <TouchableOpacity onPress={handleSave} activeOpacity={0.8} style={styles.saveBtnContainer}>
            <LinearGradient
              colors={[colors.primary, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveBtn, SHADOWS.glow]}
            >
              <Text style={[TYPOGRAPHY.bodyMedium, { color: '#ffffff' }]}>Save to Tax Account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </MotiView>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginLeft: SIZES.small, flex: 1 }]}>
          Adding savings helps you track how much of your estimated tax you've successfully set aside.
        </Text>
      </View>
      <CustomAlert
        visible={isErrorVisible}
        title="Invalid Amount"
        message="Please enter a valid savings amount."
        confirmText="Got it"
        onConfirm={() => setIsErrorVisible(false)}
        onCancel={() => setIsErrorVisible(false)}
      />
      
      <CustomAlert
        visible={isSuccessVisible}
        title="Success"
        message="Tax savings added successfully!"
        confirmText="OK"
        onConfirm={() => {
          setIsSuccessVisible(false);
          navigation.goBack();
        }}
        onCancel={() => {
          setIsSuccessVisible(false);
          navigation.goBack();
        }}
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
  progressCard: {
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.large,
    borderWidth: 1,
    ...SHADOWS.soft,
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
    paddingVertical: SIZES.tiny,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    marginRight: 4,
  },
  input: {
    fontSize: 28,
    fontFamily: FONTS.semiBold,
    flex: 1,
  },
  saveBtnContainer: {
    marginTop: SIZES.xxlarge,
  },
  saveBtn: {
    paddingVertical: SIZES.medium,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xlarge,
    paddingHorizontal: SIZES.small,
  },
});
