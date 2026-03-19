import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { SIZES, TYPOGRAPHY, SHADOWS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { Currency } from '../types/income';

interface CountryOption {
  id: string;
  name: string;
  currency: Currency;
  flag: string;
  isSupported?: boolean;
}

const COUNTRIES: CountryOption[] = [
  { id: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', isSupported: true },
  { id: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸', isSupported: false },
  { id: 'UK', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧', isSupported: true },
  { id: 'EU', name: 'European Union', currency: 'EUR', flag: '🇪🇺', isSupported: false },
  { id: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦', isSupported: false },
];

export const CountrySelectorScreen = () => {
  const { colors, isDark } = useTheme();
  const { updateSettings } = useAppContext();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  const handleComplete = async () => {
    if (selectedCountry) {
      await updateSettings({
        country: selectedCountry.id,
        preferredCurrency: selectedCountry.currency,
        hasCompletedOnboarding: true,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={isDark ? [colors.mesh1, colors.background] : [colors.mesh2, colors.background]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      <View style={styles.header}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <Text style={[TYPOGRAPHY.h1, { color: colors.text, marginBottom: SIZES.tiny }]}>Select Your Region</Text>
          <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>
            Taxlator will automatically configure your default currency and baseline tax profiles.
          </Text>
        </MotiView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {COUNTRIES.map((country, index) => {
          const isSelected = selectedCountry?.id === country.id;
          const isSupported = country.isSupported !== false;
          return (
            <MotiView
              key={country.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 + index * 100 }}
            >
              <TouchableOpacity
                activeOpacity={isSupported ? 0.7 : 1}
                onPress={isSupported ? () => setSelectedCountry(country) : undefined}
                style={[
                  styles.countryCard,
                  { backgroundColor: colors.card, borderColor: isSelected ? colors.primary : colors.border },
                  isSelected && SHADOWS.glow,
                  !isSupported && { opacity: 0.5 }
                ]}
              >
                <View style={styles.countryInfo}>
                  <Text style={[styles.flag, { fontSize: 24 }]}>{country.flag}</Text>
                  <View>
                    <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text }]}>
                      {country.name} {!isSupported && <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 'normal' }}>(Coming Soon)</Text>}
                    </Text>
                    <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary }]}>{country.currency}</Text>
                  </View>
                </View>
                
                <View style={[
                  styles.radioBtn,
                  { borderColor: isSelected ? colors.primary : colors.border },
                  isSelected && { backgroundColor: `${colors.primary}20` },
                  !isSupported && { opacity: 0.3 }
                ]}>
                  {isSelected && <Ionicons name="checkmark-sharp" size={14} color={colors.primary} />}
                </View>
              </TouchableOpacity>
            </MotiView>
          );
        })}
      </ScrollView>

      <MotiView 
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: selectedCountry ? 1 : 0.5, translateY: 0 }}
        style={styles.footer}
      >
        <TouchableOpacity 
          onPress={handleComplete} 
          disabled={!selectedCountry}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.continueButton, SHADOWS.glow]}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: '#ffffff' }]}>Complete Setup</Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.large,
    paddingTop: 80,
    paddingBottom: SIZES.large,
  },
  listContent: {
    paddingHorizontal: SIZES.large,
    paddingBottom: 100,
  },
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.small,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    marginRight: SIZES.medium,
  },
  radioBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SIZES.xlarge,
    left: SIZES.large,
    right: SIZES.large,
  },
  continueButton: {
    flexDirection: 'row',
    paddingVertical: SIZES.medium,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
