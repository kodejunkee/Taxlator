import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Currency } from '../types/income';

const CURRENCIES: Currency[] = ['NGN', 'USD', 'GBP', 'EUR'];

const THEMES: { label: string; value: ThemeMode; icon: any }[] = [
  { label: 'Light', value: 'light', icon: 'sunny-outline' },
  { label: 'Dark', value: 'dark', icon: 'moon-outline' },
  { label: 'System', value: 'system', icon: 'settings-outline' }
];

export const SettingsScreen = () => {
  const { settings, updateSettings, refreshRates, isLoading } = useAppContext();
  const { colors, mode, setMode } = useTheme();

  const handleCurrencyChange = (currency: Currency) => {
    updateSettings({ preferredCurrency: currency });
  };

  const handleRefreshRates = async () => {
    await refreshRates();
    Alert.alert('Success', 'Exchange rates updated successfully.');
  };

  const SettingSection = ({ title, description, children, delay = 0 }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay }}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Text style={[TYPOGRAPHY.h4, { color: colors.text }]}>{title}</Text>
      {description && (
        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 4, marginBottom: SIZES.large }]}>
          {description}
        </Text>
      )}
      {children}
    </MotiView>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SettingSection 
        title="Appearance" 
        description="Choose your preferred theme for the application."
        delay={100}
      >
        <View style={styles.themeRow}>
          {THEMES.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.selectableBtn,
                { borderColor: colors.border },
                mode === t.value && { backgroundColor: `${colors.primary}10`, borderColor: colors.primary }
              ]}
              onPress={() => setMode(t.value)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={t.icon} 
                size={20} 
                color={mode === t.value ? colors.primary : colors.textSecondary} 
                style={{ marginBottom: 6 }}
              />
              <Text 
                style={[
                  TYPOGRAPHY.captionMedium,
                  { color: mode === t.value ? colors.primary : colors.textSecondary }
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SettingSection>

      <SettingSection 
        title="Display Currency" 
        description="Used for side-by-side comparison with NGN amounts."
        delay={200}
      >
        <View style={styles.currencyRow}>
          {CURRENCIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.selectableBtn,
                { borderColor: colors.border },
                settings.preferredCurrency === c && { backgroundColor: `${colors.primary}10`, borderColor: colors.primary }
              ]}
              onPress={() => handleCurrencyChange(c)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  TYPOGRAPHY.bodyMedium,
                  { color: settings.preferredCurrency === c ? colors.primary : colors.textSecondary }
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SettingSection>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300 }}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.ratesHeader}>
          <Text style={[TYPOGRAPHY.h4, { color: colors.text }]}>Exchange Rates</Text>
          <TouchableOpacity 
            style={[styles.refreshBtn, { backgroundColor: `${colors.primary}15` }]} 
            onPress={handleRefreshRates}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="refresh-outline" size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 4, marginBottom: SIZES.large }]}>
          Base: 1 USD • Updated Weekly
        </Text>
        
        {['NGN', 'GBP', 'EUR'].map((curr, idx) => (
          <View 
            key={curr} 
            style={[
              styles.rateItem, 
              { borderBottomColor: colors.border, borderBottomWidth: idx === 2 ? 0 : 1 }
            ]}
          >
            <View style={styles.rateLeft}>
              <View style={[styles.rateIcon, { backgroundColor: `${colors.primary}10` }]}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary }}>{curr}</Text>
              </View>
              <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text }]}>{curr}</Text>
            </View>
            <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text }]}>
              {curr === 'NGN' ? '₦' : curr === 'GBP' ? '£' : '€'}
              {settings.exchangeRates[curr as Currency]?.toFixed(2) || '---'}
            </Text>
          </View>
        ))}
      </MotiView>

      <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: SIZES.large }]}>
        Taxlator v1.0.0
      </Text>
      <View style={{ height: 100 }} />
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
    marginBottom: SIZES.large,
    borderWidth: 1,
    ...SHADOWS.soft,
  },
  themeRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  currencyRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  selectableBtn: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderWidth: 1.5,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.medium,
    alignItems: 'center',
  },
  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
});
