import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { SIZES, TYPOGRAPHY, SHADOWS, FONTS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { Currency } from '../types/income';

import { COUNTRIES, CountryOption } from '../utils/countryData';

export const CountrySelectorScreen = () => {
  const { colors, isDark } = useTheme();
  const { updateSettings } = useAppContext();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    const q = searchQuery.toLowerCase();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q));
  }, [searchQuery]);

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

      <View style={{ paddingHorizontal: SIZES.large, marginBottom: SIZES.medium }}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search country or currency..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredCountries.map((country, index) => {
            const isSelected = selectedCountry?.id === country.id;
            const isSupported = country.isSupported !== false;
            return (
              <MotiView
                key={country.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 10 + Math.min(index * 50, 500) }}
                style={{ width: '48%' }}
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
                    <Text style={[styles.flag, { fontSize: 32 }]}>{country.flag}</Text>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text, textAlign: 'center' }]}>
                        {country.name}
                      </Text>
                      <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary }]}>{country.currency}</Text>
                      {!isSupported && (
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>(Coming Soon)</Text>
                      )}
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
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    borderRadius: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.small,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  countryCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.medium,
    minHeight: 140,
  },
  countryInfo: {
    alignItems: 'center',
  },
  flag: {
    marginBottom: SIZES.small,
  },
  radioBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
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
