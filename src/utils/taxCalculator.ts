export interface TaxCalculationResult {
  grossIncome: number;
  tax: number; // For countries with multiple taxes, this represents total deductions.
  netIncome: number;
  effectiveTaxRate: number;
  breakdown?: {
    incomeTax: number;
    nationalInsurance?: number;
    // other secondary taxes can be added here
  };
}

export function calculateNigeriaTax(incomeNGN: number): TaxCalculationResult {
  let remainingIncome = incomeNGN;
  let totalTax = 0;

  // Band 1: First ₦800,000 @ 0%
  const band1 = Math.min(800000, remainingIncome);
  remainingIncome -= band1;

  // Band 2: Next ₦2,200,000 @ 15%
  if (remainingIncome > 0) {
    const band2 = Math.min(2200000, remainingIncome);
    totalTax += band2 * 0.15;
    remainingIncome -= band2;
  }

  // Band 3: Next ₦9,000,000 @ 18%
  if (remainingIncome > 0) {
    const band3 = Math.min(9000000, remainingIncome);
    totalTax += band3 * 0.18;
    remainingIncome -= band3;
  }

  // Band 4: Next ₦13,000,000 @ 21%
  if (remainingIncome > 0) {
    const band4 = Math.min(13000000, remainingIncome);
    totalTax += band4 * 0.21;
    remainingIncome -= band4;
  }

  // Band 5: Next ₦25,000,000 @ 23%
  if (remainingIncome > 0) {
    const band5 = Math.min(25000000, remainingIncome);
    totalTax += band5 * 0.23;
    remainingIncome -= band5;
  }

  // Band 6: Above ₦50,000,000 @ 25%
  if (remainingIncome > 0) {
    totalTax += remainingIncome * 0.25;
  }

  const netIncome = incomeNGN - totalTax;
  const effectiveTaxRate = incomeNGN > 0 ? (totalTax / incomeNGN) * 100 : 0;

  return {
    grossIncome: incomeNGN,
    tax: totalTax,
    netIncome,
    effectiveTaxRate,
    breakdown: {
      incomeTax: totalTax
    }
  };
}

export function calculateUKTax(incomeGBP: number): TaxCalculationResult {
  // 1. Calculate Personal Allowance with Tapering
  let personalAllowance = 12570;
  if (incomeGBP > 100000) {
    const excess = incomeGBP - 100000;
    const deduction = excess / 2;
    personalAllowance = Math.max(0, personalAllowance - deduction);
  }

  // 2. Income Tax
  let taxableIncome = Math.max(0, incomeGBP - personalAllowance);
  let incomeTax = 0;

  // Basic Rate (20% up to £37,700 taxable over allowance)
  // Which corresponds to standard total income of £50,270 when full allowance is intact.
  const basicRateLimit = 37700;
  const higherRateLimit = 125140; // The threshold where additional rate begins (£125,140 absolute income)
  
  // Real taxable thresholds based on absolute income, but personal allowance changes
  // Let's use the standard absolute thresholds adjusted by the standard allowance mapping, 
  // ensuring the logic matches HMRC's method of applying bands to "taxable income".
  
  // Basic Rate: £0 to £37,700 of *taxable* income
  const basicBand = Math.min(basicRateLimit, taxableIncome);
  incomeTax += basicBand * 0.20;
  taxableIncome -= basicBand;

  // Higher Rate: £37,701 to £125,140 (Total income limit)
  // Taxable income above £37,700 up to whatever leaves total income at £125,140
  // Since we tapered allowance, the amount of taxable income in the higher band changes.
  // The additional rate kicks in strictly when total income > £125,140.
  if (taxableIncome > 0) {
    const incomeSubjectToAdditional = Math.max(0, incomeGBP - higherRateLimit);
    const basicAndAdditionalTotal = basicBand + incomeSubjectToAdditional;
    // Higher band is simply whatever is left that isn't basic and isn't additional
    const higherBand = Math.max(0, (incomeGBP - personalAllowance) - basicAndAdditionalTotal);
    
    incomeTax += higherBand * 0.40;
    incomeTax += incomeSubjectToAdditional * 0.45;
  }

  // 3. National Insurance (Class 1) - using absolute income thresholds
  let nationalInsurance = 0;
  const niPrimaryThreshold = 12570;
  const niUpperEarnings = 50270;

  if (incomeGBP > niPrimaryThreshold) {
    const mainRateEarnings = Math.min(incomeGBP, niUpperEarnings) - niPrimaryThreshold;
    nationalInsurance += mainRateEarnings * 0.08; // 8% main rate

    if (incomeGBP > niUpperEarnings) {
      const upperRateEarnings = incomeGBP - niUpperEarnings;
      nationalInsurance += upperRateEarnings * 0.02; // 2% upper rate
    }
  }

  const totalDeductions = incomeTax + nationalInsurance;
  const netIncome = incomeGBP - totalDeductions;
  const effectiveTaxRate = incomeGBP > 0 ? (totalDeductions / incomeGBP) * 100 : 0;

  return {
    grossIncome: incomeGBP,
    tax: totalDeductions,
    netIncome,
    effectiveTaxRate,
    breakdown: {
      incomeTax,
      nationalInsurance
    }
  };
}

export function calculateSGTax(incomeSGD: number): TaxCalculationResult {
  let remainingIncome = incomeSGD;
  let totalTax = 0;

  const bands = [
    { limit: 20000, rate: 0 },
    { limit: 10000, rate: 0.02 },
    { limit: 10000, rate: 0.035 },
    { limit: 40000, rate: 0.07 },
    { limit: 40000, rate: 0.115 },
    { limit: 40000, rate: 0.15 },
    { limit: 40000, rate: 0.18 },
    { limit: 40000, rate: 0.19 },
    { limit: 40000, rate: 0.195 },
    { limit: 40000, rate: 0.20 },
    { limit: 180000, rate: 0.22 },
    { limit: 500000, rate: 0.23 },
    { limit: Infinity, rate: 0.24 }
  ];

  for (const band of bands) {
    if (remainingIncome <= 0) break;
    const taxableInThisBand = Math.min(band.limit, remainingIncome);
    totalTax += taxableInThisBand * band.rate;
    remainingIncome -= taxableInThisBand;
  }

  const netIncome = incomeSGD - totalTax;
  const effectiveTaxRate = incomeSGD > 0 ? (totalTax / incomeSGD) * 100 : 0;

  return {
    grossIncome: incomeSGD,
    tax: totalTax,
    netIncome,
    effectiveTaxRate,
    breakdown: {
      incomeTax: totalTax
    }
  };
}

export function calculateTax(income: number, countryCode: string): TaxCalculationResult {
  switch (countryCode) {
    case 'UK':
      return calculateUKTax(income);
    case 'SG':
      return calculateSGTax(income);
    case 'NG':
    default:
      return calculateNigeriaTax(income);
  }
}
