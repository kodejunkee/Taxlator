import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Currency } from '../types/income';

interface Props {
  amountNGN: number;
  amountPreferred?: number;
  preferredCurrency?: Currency;
  isNegative?: boolean;
  style?: any;
  textStyle?: any;
}

export const CurrencyDisplay: React.FC<Props> = ({
  amountNGN,
  amountPreferred,
  preferredCurrency,
  isNegative = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const formatMoney = (val: number, curr: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(val);
  };

  const defaultColor = isNegative ? colors.tax : colors.text;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.mainAmount, { color: defaultColor }, textStyle]}>
        {formatMoney(amountNGN, 'NGN')}
      </Text>
      {preferredCurrency && preferredCurrency !== 'NGN' && amountPreferred !== undefined && (
        <Text style={[styles.subAmount, { color: colors.textSecondary }, textStyle]}>
          ({formatMoney(amountPreferred, preferredCurrency)})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  mainAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subAmount: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
});
