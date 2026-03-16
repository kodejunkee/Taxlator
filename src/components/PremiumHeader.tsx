import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { SIZES, TYPOGRAPHY } from '../theme';

interface PremiumHeaderProps {
  title: string;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({ title }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Text style={[styles.title, TYPOGRAPHY.h2, { color: colors.text }]}>{title}</Text>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.small,
  },
  title: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
  },
  divider: {
    height: 1,
    opacity: 0.5,
    marginTop: SIZES.tiny,
  },
});
