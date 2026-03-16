import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES, TYPOGRAPHY } from '../theme';

interface PremiumHeaderProps {
  title: string;
  onBack?: () => void;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({ title, onBack }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity 
            onPress={onBack} 
            style={[styles.backButton, { backgroundColor: `${colors.primary}10` }]}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, TYPOGRAPHY.h2, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  title: {
    flex: 1,
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
  },
  divider: {
    height: 1,
    opacity: 0.5,
    marginTop: SIZES.tiny,
  },
});
