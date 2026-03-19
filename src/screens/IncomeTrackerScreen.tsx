import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS, TYPOGRAPHY } from '../theme';
import { useAppContext } from '../context/AppContext';
import { getBaseCurrency } from '../utils/countryData';
import { useTheme } from '../context/ThemeContext';
import { IncomeItem } from '../components/IncomeItem';
import { TaxSummaryCard } from '../components/TaxSummaryCard';
import { calculateTax } from '../utils/taxCalculator';
import { convertFromBaseCurrency, convertToBaseCurrency } from '../utils/currencyConverter';
import { formatMoney } from '../utils/formatters';

import { CustomAlert } from '../components/common/CustomAlert';

type NavProp = NativeStackNavigationProp<any>;

export const IncomeTrackerScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { incomes, savings, settings, clearIncomes } = useAppContext();
  const { colors, isDark } = useTheme();
  const [isResetAlertVisible, setIsResetAlertVisible] = React.useState(false);

  const baseCurrency = getBaseCurrency(settings.country);
  const totalGrossBase = incomes.reduce((sum, item) => sum + convertToBaseCurrency(item.amount, item.currency, baseCurrency, settings.exchangeRates), 0);
  const taxResults = calculateTax(totalGrossBase, settings.country);
  const netIncome = totalGrossBase - taxResults.tax;

  const handleReset = () => {
    setIsResetAlertVisible(true);
  };

  const confirmReset = () => {
    clearIncomes();
    setIsResetAlertVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Immersive Mesh Header */}
      <View style={[styles.headerMesh, { backgroundColor: isDark ? colors.mesh1 : colors.mesh2 }]}>
        <LinearGradient
          colors={['transparent', colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <MotiView
          from={{ translateY: 10 }}
          animate={{ translateY: 0 }}
          style={styles.summaryContent}
        >
          <Text style={[TYPOGRAPHY.label, { color: colors.accent, marginBottom: SIZES.tiny }]}>Cumulative Annual Gross</Text>
          <Text style={[TYPOGRAPHY.h1, { color: colors.text, fontSize: 42 }]}>
            {formatMoney(totalGrossBase, baseCurrency)}
          </Text>
          {settings.preferredCurrency !== baseCurrency && (
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 4 }]}>
              ≈ {formatMoney(convertFromBaseCurrency(totalGrossBase, baseCurrency, settings.preferredCurrency, settings.exchangeRates), settings.preferredCurrency)}
            </Text>
          )}
        </MotiView>
      </View>

      <View style={styles.metricsRow}>
        <TaxSummaryCard
          title="Est. Tax"
          amountBase={taxResults.tax}
          type="tax"
          delay={200}
          size="small"
        />
        <View style={{ width: SIZES.small }} />
        <TaxSummaryCard
          title="Net Income"
          amountBase={netIncome}
          type="income"
          delay={300}
          size="small"
        />
      </View>

      <View style={styles.listHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Earnings History</Text>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
        </View>
        {incomes.length > 0 && (
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
            <Text style={[TYPOGRAPHY.captionMedium, { color: colors.tax }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={[...incomes].reverse()}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ translateY: 5 }}
            animate={{ translateY: 0 }}
            transition={{ delay: 400 + index * 50 }}
          >
            <IncomeItem
              item={item}
              preferredCurrency={settings.preferredCurrency}
              exchangeRates={settings.exchangeRates}
            />
          </MotiView>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <MotiView
            animate={{ opacity: 1 }}
            transition={{ delay: 500 }}
            style={styles.emptyContainer}
          >
            <View style={[styles.emptyIconWrapper, { backgroundColor: `${colors.accent}15` }]}>
              <Ionicons name="receipt-outline" size={32} color={colors.accent} />
            </View>
            <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.text, marginTop: SIZES.medium }]}>No entries yet</Text>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 4 }]}>Your earnings will appear here</Text>
          </MotiView>
        }
      />

      <MotiView
        from={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 800, damping: 20 }}
        style={styles.fabContainer}
      >
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.accent }, SHADOWS.glow]}
          onPress={() => {
            navigation.navigate('AddIncome');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#ffffff" />
        </TouchableOpacity>
      </MotiView>
      <CustomAlert
        visible={isResetAlertVisible}
        title="Reset Year"
        message="Are you sure you want to delete all income records for the year?"
        confirmText="Reset"
        isDestructive
        onConfirm={confirmReset}
        onCancel={() => setIsResetAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerMesh: {
    height: 300,
    justifyContent: 'center',
    paddingHorizontal: SIZES.large,
    marginTop: -90,
  },
  summaryContent: {
    marginTop: 40,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.large,
    marginTop: -60,
    zIndex: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    marginTop: SIZES.xlarge,
    marginBottom: SIZES.medium,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: SIZES.small,
  },
  listContent: {
    paddingHorizontal: SIZES.large,
    paddingBottom: 150,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xxlarge,
  },
  emptyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: SIZES.large + 90,
    right: SIZES.large,
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
