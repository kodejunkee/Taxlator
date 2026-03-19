import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { getBaseCurrency } from '../utils/countryData';
import { Currency } from '../types/income';
import { formatMoney } from '../utils/formatters';

interface Props {
  amountBase: number;
  amountPreferred?: number;
  preferredCurrency?: Currency;
  isNegative?: boolean;
  style?: any;
  textStyle?: any;
}

export const CurrencyDisplay: React.FC<Props> = ({
  amountBase,
  amountPreferred,
  preferredCurrency,
  isNegative = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const { settings } = useAppContext();
  const baseCurrency = getBaseCurrency(settings.country);

  const defaultColor = isNegative ? colors.tax : colors.text;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.mainAmount, { color: defaultColor }, textStyle]}>
        {formatMoney(amountBase, baseCurrency)}
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
