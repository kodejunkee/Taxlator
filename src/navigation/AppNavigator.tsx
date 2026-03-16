import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { CustomTabBar } from './CustomTabBar';
import { PremiumHeader } from '../components/PremiumHeader';

import {
  HomeScreen,
  SalaryCalculatorScreen,
  IncomeTrackerScreen,
  SettingsScreen,
  AddIncomeScreen,
  AddTaxSavingsScreen,
  ReportScreen,
} from '../screens';

export type RootStackParamList = {
  MainTabs: undefined;
  AddIncome: undefined;
  AddTaxSavings: undefined;
  Report: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Calculator: undefined;
  Tracker: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        header: ({ route }) => {
          let title = 'Taxlator';
          if (route.name === 'Calculator') title = 'Calculator';
          else if (route.name === 'Tracker') title = 'Income';
          else if (route.name === 'Settings') title = 'Settings';
          return <PremiumHeader title={title} />;
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="Calculator" component={SalaryCalculatorScreen} options={{ title: 'Calculator' }} />
      <Tab.Screen name="Tracker" component={IncomeTrackerScreen} options={{ title: 'Income' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isDark, colors } = useTheme();

  // Create a custom React Navigation theme that matches our dark/light mode context exactly
  const AppNavTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={AppNavTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen 
          name="AddIncome" 
          component={AddIncomeScreen} 
          options={({ navigation }) => ({ 
            header: () => <PremiumHeader title="Add Income" onBack={() => navigation.goBack()} /> 
          })} 
        />
        <Stack.Screen 
          name="AddTaxSavings" 
          component={AddTaxSavingsScreen} 
          options={({ navigation }) => ({ 
            header: () => <PremiumHeader title="Add Tax Savings" onBack={() => navigation.goBack()} /> 
          })} 
        />
        <Stack.Screen 
          name="Report" 
          component={ReportScreen} 
          options={({ navigation }) => ({ 
            header: () => <PremiumHeader title="Yearly Report" onBack={() => navigation.goBack()} /> 
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
