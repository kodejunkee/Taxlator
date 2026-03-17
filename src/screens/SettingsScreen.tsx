import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Currency } from '../types/income';

import { CustomAlert } from '../components/common/CustomAlert';

const THEMES: { label: string; value: ThemeMode; icon: any }[] = [
  { label: 'Light', value: 'light', icon: 'sunny-outline' },
  { label: 'Dark', value: 'dark', icon: 'moon-outline' },
  { label: 'System', value: 'system', icon: 'settings-outline' }
];
const SettingSection = ({ title, description, children, delay = 0 }: any) => {
  const { colors } = useTheme();
  return (
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
};

export const SettingsScreen = () => {
  const { settings, updateSettings, refreshRates, isLoading, playClickSound } = useAppContext();
  const { colors, mode, setMode } = useTheme();
  const [alertConfig, setAlertConfig] = React.useState({
    visible: false,
    title: '',
    message: '',
    isDestructive: false,
  });

  const handleRefreshRates = async () => {
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      setAlertConfig({
        visible: true,
        title: 'No Internet Connection',
        message: 'Please check your connection and try again.',
        isDestructive: true,
      });
      return;
    }

    try {
      await refreshRates();
      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Exchange rates updated successfully.',
        isDestructive: false,
      });
    } catch (error) {
       setAlertConfig({
        visible: true,
        title: 'Sync Failed',
        message: 'Could not fetch latest rates. Please try again later.',
        isDestructive: true,
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
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

      <SettingSection
        title="Appearance"
        description="Choose your preferred theme for the application."
        delay={300}
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
        title="Preferences"
        description="Manage app behavior and feedback."
        delay={400}
      >
        <View style={styles.preferenceRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="volume-high-outline" size={24} color={colors.textSecondary} style={{ marginRight: 12 }} />
            <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text }]}>Sound Effects</Text>
          </View>
          <Switch
            value={settings.soundEnabled ?? true}
            onValueChange={(val) => {
              updateSettings({ soundEnabled: val });
              if (val) playClickSound();
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={'#ffffff'}
          />
        </View>
      </SettingSection>

      <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: SIZES.large }]}>
        Taxlator v1.0.0
      </Text>
      <View style={{ height: 100 }} />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        isDestructive={alertConfig.isDestructive}
        confirmText="Got it"
        onConfirm={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
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
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
