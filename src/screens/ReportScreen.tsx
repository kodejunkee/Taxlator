import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS, TYPOGRAPHY, FONTS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { getBaseCurrency } from '../utils/countryData';
import { useTheme } from '../context/ThemeContext';
import { calculateTax } from '../utils/taxCalculator';
import { formatMoney, getCurrencySymbol } from '../utils/formatters';
import { convertToBaseCurrency } from '../utils/currencyConverter';

import { CustomAlert } from '../components/common/CustomAlert';

const { width: screenWidth } = Dimensions.get('window');

export const ReportScreen = () => {
  const { incomes, savings, settings } = useAppContext();
  const { colors, isDark } = useTheme();
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);

  const baseCurrency = getBaseCurrency(settings.country);
  const totalGrossBase = incomes.reduce((sum, item) => sum + convertToBaseCurrency(item.amount, item.currency, baseCurrency, settings.exchangeRates), 0);
  const taxResults = calculateTax(totalGrossBase, settings.country);
  const totalSaved = savings.reduce((sum, item) => sum + item.amount, 0);

  // Group incomes by month for the chart
  const monthlyData = new Array(12).fill(0);
  incomes.forEach(income => {
    const date = new Date(income.date);
    const month = date.getMonth(); // 0 - 11
    monthlyData[month] += convertToBaseCurrency(income.amount, income.currency, baseCurrency, settings.exchangeRates);
  });

  const chartData = {
    labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    datasets: [
      {
        data: monthlyData,
        color: (opacity = 1) => colors.primary,
        strokeWidth: 3
      }
    ]
  };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
            body { font-family: 'Outfit', sans-serif; padding: 40px; color: #1f2937; background-color: #ffffff; }
            .header { border-bottom: 2px solid ${colors.primary}; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { color: ${colors.primary}; font-size: 28px; font-weight: 700; }
            .date { color: #6b7280; font-size: 14px; }
            .summary-card { background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px; }
            .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 16px; font-weight: 600; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .label { color: #4b5563; }
            .value { font-weight: 600; color: #111827; }
            .tax { color: #e11d48; }
            .income { color: #059669; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">Taxlator</div>
            <div class="date">Report Date: ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>

          <div class="summary-card">
            <div class="section-title">Income & Tax Summary</div>
            <div class="row">
              <span class="label">Annual Gross Income</span>
              <span class="value">${formatMoney(totalGrossBase, baseCurrency)}</span>
            </div>
            ${taxResults.breakdown?.nationalInsurance ? `
            <div class="row">
              <span class="label">Income Tax</span>
              <span class="value tax">${formatMoney(taxResults.breakdown.incomeTax, baseCurrency)}</span>
            </div>
            <div class="row">
              <span class="label">National Insurance</span>
              <span class="value tax">${formatMoney(taxResults.breakdown.nationalInsurance, baseCurrency)}</span>
            </div>
            <div class="row">
              <span class="label">Total Deductions</span>
              <span class="value tax">${formatMoney(taxResults.tax, baseCurrency)}</span>
            </div>
            ` : `
            <div class="row">
              <span class="label">Estimated Tax Liability</span>
              <span class="value tax">${formatMoney(taxResults.tax, baseCurrency)}</span>
            </div>
            `}
            <div class="row">
              <span class="label">Calculated Net Income</span>
              <span class="value income">${formatMoney(taxResults.netIncome, baseCurrency)}</span>
            </div>
          </div>
          ${settings.country === 'SG' ? `
          <div style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: -15px; margin-bottom: 25px;">
            * Calculations reflect Singapore Resident Individual Baseline Bracket (YA 2024)
          </div>
          ` : ''}

          <div class="summary-card">
            <div class="section-title">Compliance & Savings</div>
            <div class="row">
              <span class="label">Tax Savings Realized</span>
              <span class="value income">${formatMoney(totalSaved, baseCurrency)}</span>
            </div>
            <div class="row">
              <span class="label">Unfunded Tax Liability</span>
              <span class="value tax">${formatMoney(Math.max(taxResults.tax - totalSaved, 0), baseCurrency)}</span>
            </div>
            <div class="row">
              <span class="label">Effective Tax Rate</span>
              <span class="value">${taxResults.effectiveTaxRate.toFixed(2)}%</span>
            </div>
          </div>

          <div class="footer">
            Confidential Tax Report • Generated by Taxlator Mobile
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Print.printAsync({ uri });
    } catch (error) {
      setIsErrorVisible(true);
    }
  };

  const SummaryItem = ({ label, value, color = colors.text, delay = 0 }: any) => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      style={[styles.summaryItem, { borderBottomColor: colors.border }]}
    >
      <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[TYPOGRAPHY.bodyBold, { color }]}>{value}</Text>
    </MotiView>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[TYPOGRAPHY.h3, { color: colors.text, marginBottom: SIZES.large }]}>Yearly Summary</Text>
        <SummaryItem label="Total Income" value={formatMoney(totalGrossBase, baseCurrency)} delay={200} />
        {taxResults.breakdown?.nationalInsurance ? (
          <>
            <SummaryItem label="Income Tax" value={formatMoney(taxResults.breakdown.incomeTax, baseCurrency)} color={colors.tax} delay={300} />
            <SummaryItem label="National Insurance" value={formatMoney(taxResults.breakdown.nationalInsurance, baseCurrency)} color={colors.tax} delay={350} />
            <SummaryItem label="Total Deductions" value={formatMoney(taxResults.tax, baseCurrency)} color={colors.tax} delay={380} />
          </>
        ) : (
          <SummaryItem label="Estimated Tax" value={formatMoney(taxResults.tax, baseCurrency)} color={colors.tax} delay={300} />
        )}
        <SummaryItem label="Net Income" value={formatMoney(taxResults.netIncome, baseCurrency)} color={colors.income} delay={400} />
        <SummaryItem label="Tax Savings" value={formatMoney(totalSaved, baseCurrency)} delay={500} />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 600 }}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[TYPOGRAPHY.h3, { color: colors.text, marginBottom: SIZES.medium }]}>Income Trend</Text>
        <LineChart
          data={chartData}
          width={screenWidth - SIZES.large * 2 - SIZES.medium * 2}
          height={200}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.primary,
            labelColor: (opacity = 1) => colors.textSecondary,
            style: { borderRadius: 16 },
            propsForDots: { r: "5", strokeWidth: "2", stroke: colors.primary },
            propsForBackgroundLines: { strokeDasharray: "", stroke: isDark ? '#1f2937' : '#f3f4f6' }
          }}
          bezier
          style={styles.chart}
          yAxisLabel={getCurrencySymbol(baseCurrency)}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 800 }}
      >
        <TouchableOpacity onPress={generatePDF} activeOpacity={0.8} style={styles.exportBtnContainer}>
          <LinearGradient
            colors={[colors.primary, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.exportBtn, SHADOWS.glow]}
          >
            <Ionicons name="cloud-download-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={[TYPOGRAPHY.bodyMedium, { color: '#ffffff' }]}>Export Full PDF Report</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>

      <View style={{ height: 100 }} />
      <CustomAlert
        visible={isErrorVisible}
        title="Export Failed"
        message="Failed to generate or share the PDF report. Please try again."
        confirmText="Got it"
        onConfirm={() => setIsErrorVisible(false)}
        onCancel={() => setIsErrorVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 0,
    padding: SIZES.large,
  },
  card: {
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.large,
    borderWidth: 1,
    ...SHADOWS.soft,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -10,
  },
  exportBtnContainer: {
    marginTop: SIZES.small,
  },
  exportBtn: {
    flexDirection: 'row',
    paddingVertical: SIZES.medium,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
