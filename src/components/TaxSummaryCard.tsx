import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { SIZES, SHADOWS, TYPOGRAPHY } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { CurrencyDisplay } from './CurrencyDisplay';
import { Currency } from '../types/income';

interface Props {
  title: string;
  amountNGN: number;
  amountPreferred?: number;
  preferredCurrency?: Currency;
  type: 'neutral' | 'income' | 'tax' | 'primary';
  delay?: number;
  size?: 'small' | 'large';
  showChart?: boolean;
}

export const TaxSummaryCard: React.FC<Props> = ({
  title,
  amountNGN,
  amountPreferred,
  preferredCurrency,
  type,
  delay = 0,
  size = 'large',
  showChart = false,
}) => {
  const { colors, isDark } = useTheme();

  let isLightText = false;
  let gradientColors: readonly [string, string, ...string[]] = [colors.card, colors.card];
  let titleColor = colors.textSecondary;

  if (type === 'primary') {
    gradientColors = isDark 
      ? [colors.gradientStart, colors.gradientEnd] 
      : [colors.primary, colors.gradientStart];
    titleColor = 'rgba(255,255,255,0.7)';
    isLightText = true;
  } else if (type === 'income') {
    gradientColors = isDark ? ['#065F46', '#064E3B'] : ['#10B981', '#059669'];
    titleColor = 'rgba(255,255,255,0.7)';
    isLightText = true;
  } else if (type === 'tax') {
    gradientColors = isDark ? ['#7F1D1D', '#450A0A'] : ['#EF4444', '#DC2626'];
    titleColor = 'rgba(255,255,255,0.7)';
    isLightText = true;
  }

  const padding = size === 'small' ? SIZES.large : SIZES.xlarge;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95, translateY: 15 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', delay, damping: 12 }}
      style={[
        styles.container, 
        { flex: size === 'small' ? 1 : 0 },
        type === 'primary' ? SHADOWS.glow : SHADOWS.soft
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { padding }]}
      >
        <Text style={[TYPOGRAPHY.label, { color: titleColor, marginBottom: SIZES.tiny }]}>
          {title}
        </Text>
        <CurrencyDisplay 
          amountNGN={amountNGN} 
          amountPreferred={amountPreferred}
          preferredCurrency={preferredCurrency}
          isNegative={false}
          textStyle={isLightText ? { color: '#FFFFFF', fontSize: size === 'large' ? 28 : 22 } : { fontSize: size === 'large' ? 28 : 22 }}
          style={{ marginTop: 2 }}
        />
        
        {showChart && size === 'large' && (
          <View style={styles.miniChartContainer}>
            {/* Artistic mini-visual for large cards */}
            <View style={[styles.miniBar, { width: '60%', backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <View style={[styles.miniBar, { width: '40%', backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          </View>
        )}
      </LinearGradient>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.tiny,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  card: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    minHeight: 110,
  },
  miniChartContainer: {
    marginTop: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniBar: {
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
});
