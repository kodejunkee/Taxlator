import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES, TYPOGRAPHY, SHADOWS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { getBaseCurrency } from '../utils/countryData';
import { formatMoney } from '../utils/formatters';

interface Props {
  saved: number;
  target: number;
}

export const TaxProgressBar: React.FC<Props> = ({ saved, target }) => {
  const { colors } = useTheme();
  const { settings } = useAppContext();
  const baseCurrency = getBaseCurrency(settings.country);

  const percentage = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
  const remaining = Math.max(target - saved, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text }]}>Savings Progress</Text>
        <Text style={[TYPOGRAPHY.bodyBold, { color: colors.primary }]}>{percentage.toFixed(1)}%</Text>
      </View>
      
      <View style={[styles.track, { backgroundColor: colors.border, ...SHADOWS.soft }]}>
        <MotiView 
          from={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.fillContainer}
        >
          <LinearGradient
            colors={[colors.primary, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </MotiView>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>Saved</Text>
          <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.income, marginTop: 2 }]}>{formatMoney(saved, baseCurrency)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>Remaining</Text>
          <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.tax, marginTop: 2 }]}>{formatMoney(remaining, baseCurrency)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.tiny,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  track: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fillContainer: {
    height: '100%',
  },
  fill: {
    flex: 1,
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
  },
});
