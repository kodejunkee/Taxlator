import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings } from '../types/settings';
import { StorageService, defaultSettings } from '../storage/storage';
import { fetchExchangeRates } from '../utils/exchangeRateService';
import { IncomeEntry, TaxSavings } from '../types/income';

interface AppState {
  settings: UserSettings;
  incomes: IncomeEntry[];
  savings: TaxSavings[];
  isLoading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  refreshRates: () => Promise<void>;
  addIncome: (income: IncomeEntry) => Promise<void>;
  clearIncomes: () => Promise<void>;
  addSaving: (saving: TaxSavings) => Promise<void>;
  logCurrencyUsage: (code: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [incomes, setIncomes] = useState<IncomeEntry[]>([]);
  const [savings, setSavings] = useState<TaxSavings[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const storedSettings = await StorageService.getSettings();
      const storedIncomes = await StorageService.getIncomes();
      const storedSavings = await StorageService.getSavings();

      setSettings(storedSettings);
      setIncomes(storedIncomes);
      setSavings(storedSavings);

      // Attempt background rate fetch
      fetchExchangeRates().then(rates => {
        const updatedSettings = { ...storedSettings, exchangeRates: rates };
        setSettings(updatedSettings);
        StorageService.saveSettings(updatedSettings);
      });
    } catch (error) {
      console.error('Failed to load initial data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettingsPartial: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...newSettingsPartial };
    await StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const refreshRates = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchExchangeRates();
      await updateSettings({ exchangeRates: rates });
    } finally {
      setIsLoading(false);
    }
  };

  const addIncome = async (income: IncomeEntry) => {
    await StorageService.saveIncome(income);
    setIncomes([...incomes, income]);
  };

  const clearIncomes = async () => {
    await StorageService.clearIncomes();
    setIncomes([]);
  };

  const addSaving = async (saving: TaxSavings) => {
    await StorageService.saveSaving(saving);
    setSavings([...savings, saving]);
  };

  const logCurrencyUsage = async (code: string) => {
    const usage = { ...(settings.currencyUsage || {}) };
    usage[code] = (usage[code] || 0) + 1;
    await updateSettings({ currencyUsage: usage });
  };


  return (
    <AppContext.Provider value={{
      settings, incomes, savings, isLoading,
      updateSettings, refreshRates, addIncome, clearIncomes, addSaving, logCurrencyUsage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
