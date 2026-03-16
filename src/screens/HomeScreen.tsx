import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { SIZES, TYPOGRAPHY } from '../theme';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { TaxSummaryCard } from '../components/TaxSummaryCard';
import { ArtisticTile } from '../components/ArtisticTile';
import { convertFromNGN } from '../utils/currencyConverter';
import { calculateNigeriaTax } from '../utils/taxCalculator';

const { width } = Dimensions.get('window');
type CombinedNavProp = NativeStackNavigationProp<any> & BottomTabNavigationProp<any>;

export const HomeScreen = () => {
  const navigation = useNavigation<CombinedNavProp>();
  const { incomes, savings, settings } = useAppContext();
  const { colors, isDark } = useTheme();

  const totalGrossNGN = incomes.reduce((sum, item) => sum + item.amountNGN, 0);
  const taxResults = calculateNigeriaTax(totalGrossNGN);
  const totalSaved = savings.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalGrossNGN - taxResults.tax;

  const preferredGross = convertFromNGN(totalGrossNGN, settings.preferredCurrency, settings.exchangeRates);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={isDark ? [colors.mesh1, colors.background] : [colors.mesh2, colors.background]}
          style={{ height: 400 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <Text style={[TYPOGRAPHY.label, { color: colors.accent, marginBottom: 4 }]}>Yearly Financial Overview</Text>
          <Text style={[TYPOGRAPHY.h1, { color: colors.text, fontSize: 38 }]}>Hello there.</Text>
          <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>Ready to track your income?</Text>
        </MotiView>

        <View style={styles.bentoGrid}>
          <View style={styles.bentoLarge}>
            <TaxSummaryCard
              title="Gross Income"
              amountNGN={totalGrossNGN}
              amountPreferred={settings.preferredCurrency !== 'NGN' ? preferredGross : undefined}
              preferredCurrency={settings.preferredCurrency}
              type="primary"
              delay={200}
              showChart
            />
          </View>

          <View style={styles.bentoRow}>
            <TaxSummaryCard
              title="Est. Tax"
              amountNGN={taxResults.tax}
              type="tax"
              delay={400}
              size="small"
            />
            <View style={{ width: SIZES.small }} />
            <TaxSummaryCard
              title="Net Income"
              amountNGN={netIncome}
              type="income"
              delay={500}
              size="small"
            />
          </View>
        </View>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 600 }}
          style={styles.sectionHeader}
        >
          <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Actions</Text>
          <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        </MotiView>

        <View style={styles.actionGrid}>
          <View style={styles.actionRow}>
            <ArtisticTile
              title="Calculator"
              icon="calculator-outline"
              onPress={() => navigation.navigate('Calculator')}
              color={colors.primary}
              delay={700}
              style={{ flex: 1 }}
            />
            <ArtisticTile
              title="Tracker"
              icon="wallet-outline"
              onPress={() => navigation.navigate('Tracker')}
              color={colors.income}
              delay={800}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.actionRow}>
            <ArtisticTile
              title="Savings"
              icon="leaf-outline"
              onPress={() => navigation.navigate('AddTaxSavings')}
              color={colors.secondary}
              delay={900}
              style={{ flex: 1 }}
            />
            <ArtisticTile
              title="Analytics"
              icon="bar-chart-outline"
              onPress={() => navigation.navigate('Report')}
              color={colors.accent}
              delay={1000}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.large,
    paddingTop: 0,
  },
  header: {
    marginTop: 60,
    marginBottom: SIZES.xlarge,
  },
  bentoGrid: {
    marginBottom: SIZES.large,
  },
  bentoLarge: {
    marginBottom: SIZES.small,
  },
  bentoRow: {
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    marginTop: SIZES.large,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: SIZES.small,
  },
  actionGrid: {
    marginHorizontal: -SIZES.tiny,
  },
  actionRow: {
    flexDirection: 'row',
  },
});
