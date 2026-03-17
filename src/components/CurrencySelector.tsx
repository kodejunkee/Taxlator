import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES, TYPOGRAPHY, SHADOWS, FONTS } from '../theme';
import { getCurrencyData } from '../utils/currencyData';
import { useAppContext } from '../context/AppContext';

interface Props {
  currencyCode: string;
  onPress: () => void;
  style?: any;
}

export const CurrencySelector: React.FC<Props> = ({ currencyCode, onPress, style }) => {
  const { colors, isDark } = useTheme();
  const { playClickSound } = useAppContext();
  const data = getCurrencyData(currencyCode);

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={() => {
        playClickSound();
        onPress();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.inner}>
        <Image 
          source={{ uri: `https://flagcdn.com/w160/${data.flag}.png` }} 
          style={styles.flag} 
        />
        <Text style={[styles.code, { color: isDark ? '#E2E8F0' : '#475569' }]}>
          {currencyCode}
        </Text>
        <Ionicons name="caret-forward" size={16} color={isDark ? '#94A3B8' : '#94A3B8'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  code: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    marginLeft: 8,
    marginRight: 4,
    letterSpacing: 0.5,
  },
});
