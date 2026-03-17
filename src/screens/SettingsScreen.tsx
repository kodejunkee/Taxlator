import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Switch, Image } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Currency } from '../types/income';

import { CustomAlert } from '../components/common/CustomAlert';
import { getCurrencyData } from '../utils/currencyData';

const THEMES: { label: string; value: ThemeMode; icon: any }[] = [
  { label: 'Light', value: 'light', icon: 'sunny-outline' },
  { label: 'Dark', value: 'dark', icon: 'moon-outline' },
  { label: 'System', value: 'system', icon: 'settings-outline' }
];
const ListSection = ({ title, description, children, delay = 0 }: any) => {
  const { colors } = useTheme();
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay }}
      style={styles.section}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: SIZES.small }}>
        <Text style={[TYPOGRAPHY.label, { color: colors.primary, opacity: 0.8 }]}>{title}</Text>
        {description && (
          <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textSecondary, fontSize: 12 }]}>{description}</Text>
        )}
      </View>
      <View style={[styles.listContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </MotiView>
  );
};

const SettingItem = ({ icon, label, rightElement, onPress, isLast = false }: any) => {
  const { colors } = useTheme();
  const Content = (
    <View style={[styles.settingRow, !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}10` }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text }]}>{label}</Text>
      </View>
      {rightElement}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }
  return Content;
};

const RadioOption = ({ label, selected, onPress, isLast = false }: any) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.radioRow, !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
      activeOpacity={0.7}
    >
      <Text style={[TYPOGRAPHY.body, { color: selected ? colors.text : colors.textSecondary }]}>{label}</Text>
      <View style={[
        styles.radioOuter,
        { borderColor: selected ? colors.primary : colors.textSecondary }
      ]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
      </View>
    </TouchableOpacity>
  );
};

export const SettingsScreen = () => {
  const { settings, refreshRates, isLoading } = useAppContext();
  const { colors, mode, setMode, isDark } = useTheme();
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

      <ListSection title="Exchange Rates" description="Base: 1 USD" delay={200}>
        <SettingItem
          icon="sync-outline"
          label="Sync Rates"
          rightElement={
            isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            )
          }
          onPress={handleRefreshRates}
        />
        {['NGN', 'GBP', 'EUR'].map((curr, idx) => {
          const data = getCurrencyData(curr);
          const value = settings.exchangeRates[curr as Currency];
          return (
            <View key={curr} style={[styles.rateRow, idx === 2 && { borderBottomWidth: 0 }, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={styles.rateLeft}>
                <Image
                  source={{ uri: `https://flagcdn.com/w160/${data.flag}.png` }}
                  style={[styles.rateFlag, { opacity: isDark ? 0.8 : 1 }]}
                />
                <View>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text }]}>{curr}</Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>{data.name}</Text>
                </View>
              </View>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text }]}>
                {curr === 'NGN' ? '₦' : curr === 'GBP' ? '£' : '€'}
                {value ? value.toFixed(2) : '---'}
              </Text>
            </View>
          );
        })}
      </ListSection>

      <ListSection title="Appearance" delay={400}>
        {THEMES.map((t, idx) => (
          <RadioOption
            key={t.value}
            label={t.label}
            selected={mode === t.value}
            onPress={() => setMode(t.value)}
            isLast={idx === THEMES.length - 1}
          />
        ))}
      </ListSection>

      <View style={styles.footer}>
        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, opacity: 0.6 }]}>
          Taxlator v1.0.0
        </Text>
      </View>

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
  header: {
    marginBottom: SIZES.xlarge,
    marginTop: SIZES.medium,
  },
  section: {
    marginBottom: SIZES.xlarge,
  },
  listContainer: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.medium,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.medium,
    paddingVertical: SIZES.medium + 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.medium,
  },
  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateFlag: { // Added rateFlag style
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: SIZES.medium,
  },
  footer: {
    marginTop: SIZES.xlarge,
    alignItems: 'center',
    paddingBottom: SIZES.xxlarge,
  },
});

