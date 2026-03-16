import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Currency } from '../types/income';
import { convertToNGN, convertFromNGN } from '../utils/currencyConverter';
import { calculateNigeriaTax } from '../utils/taxCalculator';
import { CurrencySelector } from '../components/CurrencySelector';
import { CurrencyModal } from '../components/CurrencyModal';
import { getCurrencySymbol, formatInputAmount, parseFormattedAmount } from '../utils/formatters';

const CURRENCIES: Currency[] = ['NGN', 'USD', 'GBP', 'EUR'];

export const SalaryCalculatorScreen = () => {
  const { settings, updateSettings } = useAppContext();
  const { colors, isDark } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('NGN');
  const [salary, setSalary] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectCurrency = (code: string) => {
    setSelectedCurrency(code);
    if (code !== 'NGN') {
      updateSettings({ preferredCurrency: code });
    }
  };
  const numericSalary = parseFormattedAmount(salary);

  const monthlySalaryNGN = convertToNGN(numericSalary, selectedCurrency, settings.exchangeRates);
  const annualGrossNGN = monthlySalaryNGN * 12;
  const taxResults = calculateNigeriaTax(annualGrossNGN);
  const monthlyNetNGN = taxResults.netIncome / 12;

  const formatMoney = (val: number, cur: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const ArtisticResult = ({ label, amountNGN, color = colors.text, delay = 0, isLarge = false }: any) => {
    // Determine which currency to show as secondary
    // If selected is NGN, we might still show the global preferred one
    // But user said: "If selected = naira, no secondary display. If selects dollar = secondary shows in dollar"
    // This implies for THIS screen results, we follow the selected currency.
    const secondaryCurrency = selectedCurrency !== 'NGN' ? selectedCurrency : null;
    const amountSec = secondaryCurrency ? convertFromNGN(amountNGN, secondaryCurrency, settings.exchangeRates) : null;

    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', delay }}
        style={[
          styles.resultTile,
          { backgroundColor: colors.card, borderColor: colors.border },
          isLarge && { minHeight: 120, flex: 0, width: '100%' }
        ]}
      >
        <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[isLarge ? TYPOGRAPHY.h1 : TYPOGRAPHY.h3, { color, marginTop: SIZES.tiny }]}>
          {formatMoney(amountNGN, 'NGN')}
        </Text>
        {secondaryCurrency && (
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 4 }]}>
            {formatMoney(amountSec!, secondaryCurrency)}
          </Text>
        )}
      </MotiView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.inputSection}
        >
          <Text style={[TYPOGRAPHY.label, { color: colors.accent, marginBottom: SIZES.tiny }]}>Monthly Gross Salary</Text>
          <View style={[styles.inputWrapper, { borderBottomColor: colors.border }]}>
            <CurrencySelector
              currencyCode={selectedCurrency}
              onPress={() => setIsModalVisible(true)}
              style={styles.selector}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={isDark ? '#334155' : '#CBD5E1'}
              value={salary}
              onChangeText={(text) => setSalary(formatInputAmount(text))}
            />
          </View>
        </MotiView>

        <View style={styles.sectionHeader}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Yearly Projection</Text>
          <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        </View>

        <View style={styles.bentoGrid}>
          <ArtisticResult label="Total Gross 2026" amountNGN={taxResults.grossIncome} delay={200} isLarge />

          <View style={styles.bentoRow}>
            <ArtisticResult label="Est. Tax" amountNGN={taxResults.tax} color={colors.tax} delay={300} />
            <View style={{ width: SIZES.small }} />
            <ArtisticResult label="Take Home" amountNGN={taxResults.netIncome} color={colors.income} delay={400} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Monthly View</Text>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
        </View>

        <View style={styles.bentoRow}>
          <ArtisticResult label="Gross" amountNGN={monthlySalaryNGN} delay={500} />
          <View style={{ width: SIZES.small }} />
          <ArtisticResult label="Net" amountNGN={monthlyNetNGN} color={colors.income} delay={600} />
        </View>
        <ArtisticResult label="Tax" amountNGN={taxResults.tax / 12} color={colors.tax} delay={700} />

        <View style={{ height: 120 }} />
      </ScrollView>

      <CurrencyModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedCurrency={selectedCurrency}
        onSelect={handleSelectCurrency}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.large,
  },
  inputSection: {
    marginBottom: SIZES.xlarge,
    marginTop: SIZES.small,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  selector: {
    marginRight: 4,
    marginTop: 12,
  },
  input: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    marginTop: SIZES.medium,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: SIZES.small,
  },
  bentoGrid: {
    marginBottom: SIZES.small,
  },
  bentoRow: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
  },
  resultTile: {
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    ...SHADOWS.soft,
    marginBottom: SIZES.small,
    flex: 1,
  },
});
