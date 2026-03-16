export interface TaxCalculationResult {
  grossIncome: number;
  tax: number;
  netIncome: number;
  effectiveTaxRate: number;
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
  };
}
