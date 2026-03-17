import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { SIZES, SHADOWS, TYPOGRAPHY } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';

interface ArtisticTileProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
  delay?: number;
  style?: ViewStyle;
}

export const ArtisticTile: React.FC<ArtisticTileProps> = ({ 
  title, 
  icon, 
  onPress, 
  color, 
  delay = 0,
  style 
}) => {
  const { colors } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', delay, damping: 15 }}
      style={[styles.container, style]}
    >
      <TouchableOpacity 
        style={[styles.tile, { backgroundColor: colors.card, borderColor: colors.border }]} 
        onPress={() => {
          onPress();
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text, marginTop: SIZES.small }]}>{title}</Text>
        <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary, fontSize: 9, marginTop: 2 }]}>View Details</Text>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.tiny,
  },
  tile: {
    padding: SIZES.large,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    ...SHADOWS.soft,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
});
