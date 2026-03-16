import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, FONTS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { IncomeEntry, Currency } from '../types/income';

interface Props {
  item: IncomeEntry;
  preferredCurrency: Currency;
  exchangeRates: any;
}

export const IncomeItem: React.FC<Props> = ({ item, preferredCurrency, exchangeRates }) => {
  const { colors } = useTheme();

  const formatMoney = (val: number, curr: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const amountPref = (() => {
    if (preferredCurrency === item.currency) return item.amount;
    const amountUSD = item.amount / exchangeRates[item.currency];
    return amountUSD * exchangeRates[preferredCurrency];
  })();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.income}15` }]}>
          <Ionicons name="receipt-outline" size={20} color={colors.income} />
        </View>
        <View style={styles.details}>
          <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text }]} numberOfLines={1}>
            {item.description || 'Income Entry'}
          </Text>
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            {new Date(item.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.income }]}>
          +{formatMoney(item.amount, item.currency)}
        </Text>
        {preferredCurrency !== item.currency && (
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            {formatMoney(amountPref, preferredCurrency)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    borderRadius: 16,
    marginBottom: SIZES.small,
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  details: {
    flex: 1,
    marginRight: SIZES.small,
  },
  right: {
    alignItems: 'flex-end',
  },
});
