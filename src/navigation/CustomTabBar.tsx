import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, MotiText } from 'moti';
import { useTheme } from '../context/ThemeContext';
import { SIZES, SHADOWS, TYPOGRAPHY } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: colors.card, paddingBottom: insets.bottom || 10 }, SHADOWS.glow]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
          else if (route.name === 'Calculator') iconName = isFocused ? 'calculator' : 'calculator-outline';
          else if (route.name === 'Tracker') iconName = isFocused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Settings') iconName = isFocused ? 'settings' : 'settings-outline';

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as any).tabBarTestID as any}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  translateY: isFocused ? -5 : 0,
                  scale: isFocused ? 1.1 : 1,
                }}
                transition={{
                  type: 'spring',
                  damping: 10,
                  stiffness: 150,
                }}
                style={styles.iconContainer}
              >
                <MotiView
                  animate={{
                    backgroundColor: isFocused ? colors.primary : 'transparent',
                  }}
                  style={styles.activeBackground}
                />
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={isFocused ? '#ffffff' : colors.textSecondary} 
                  style={{ zIndex: 1 }}
                />
              </MotiView>
              <MotiText
                animate={{
                  opacity: isFocused ? 1 : 0.7,
                  color: isFocused ? colors.primary : colors.textSecondary,
                  translateY: isFocused ? -2 : 0,
                } as any}
                style={[styles.label, TYPOGRAPHY.captionMedium]}
              >
                {label as string}
              </MotiText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.medium,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    borderRadius: SIZES.radius + 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.small,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  activeBackground: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  label: {
    fontSize: 10,
  },
});
