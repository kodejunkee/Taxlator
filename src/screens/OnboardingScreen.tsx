import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, TYPOGRAPHY, SHADOWS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

interface SlideProps {
  isActive: boolean;
  hasBeenSeen: boolean;
}

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to Taxlator',
    description: 'Your premium personal finance and tax companion, designed to simplify complex income tracking.',
    Visual: ({ isActive, hasBeenSeen }: SlideProps) => {
      const { colors } = useTheme();
      return (
        <View style={styles.visualContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: hasBeenSeen ? 1 : 0, translateY: hasBeenSeen ? 0 : 10 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <MotiView
              from={{ scale: 0.95 }}
              animate={{ scale: 1.05 }}
              transition={{ type: 'timing', loop: true, repeatReverse: true, duration: 3000 }}
              style={{
                width: 160,
                height: 160,
                borderRadius: 36,
                overflow: 'hidden',
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                ...SHADOWS.glow,
                shadowColor: colors.primary
              }}
            >
              <Image
                source={require('../../assets/icon.png')}
                style={{ width: 160, height: 160, resizeMode: 'cover' }}
              />
            </MotiView>
          </MotiView>

          {/* Subtle floating elements behind logo */}
          <MotiView
            from={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: -10, opacity: hasBeenSeen ? 0.8 : 0 }}
            transition={{ type: 'timing', duration: 4000, loop: true, repeatReverse: true }}
            style={[styles.floatingMiniBadge, { bottom: -20, left: -20, backgroundColor: colors.card, ...SHADOWS.soft }]}
          >
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          </MotiView>
          <MotiView
            from={{ translateY: -10, opacity: 0 }}
            animate={{ translateY: 10, opacity: hasBeenSeen ? 0.8 : 0 }}
            transition={{ type: 'timing', duration: 3500, loop: true, repeatReverse: true, delay: 500 }}
            style={[styles.floatingMiniBadge, { top: -20, right: -20, backgroundColor: colors.card, ...SHADOWS.soft }]}
          >
            <Ionicons name="trending-up" size={24} color={colors.income} />
          </MotiView>
        </View>
      );
    }
  },
  {
    id: '2',
    title: 'Tax Intelligence',
    description: 'Instantly accurately estimate your tax liability based on the latest regional guidelines.',
    Visual: ({ isActive, hasBeenSeen }: SlideProps) => {
      const { colors } = useTheme();
      return (
        <View style={styles.visualContainer}>
          <MotiView
            from={{ scale: 0.9, opacity: 0, translateY: 10 }}
            animate={{
              scale: hasBeenSeen ? 1 : 0.9,
              opacity: hasBeenSeen ? 1 : 0,
              translateY: hasBeenSeen ? 0 : 10
            }}
            transition={{ type: 'spring', damping: 15 }}
            style={[styles.styledCard, { backgroundColor: colors.card, borderColor: colors.border, ...SHADOWS.medium }]}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="calculator" size={24} color={colors.primary} />
              <Text style={[TYPOGRAPHY.label, { color: colors.text }]}>Estimated Tax</Text>
            </View>
            <View style={[styles.skeletonLine, { width: '80%', backgroundColor: colors.border }]} />
            <View style={[styles.skeletonLine, { width: '50%', backgroundColor: colors.border }]} />

            <View style={{ marginTop: SIZES.large }}>
              <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary }]}>Liability</Text>
              <Text style={[TYPOGRAPHY.h2, { color: colors.tax }]}>$45,000</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ scale: 0, rotate: '-10deg' }}
            animate={{ scale: hasBeenSeen ? 1 : 0, rotate: hasBeenSeen ? '5deg' : '-10deg' }}
            transition={{ type: 'spring', damping: 12, delay: 600 }}
            style={[styles.highlightBadge, { backgroundColor: colors.tax, ...SHADOWS.glow }]}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: '#fff' }]}>Precision Calculated</Text>
          </MotiView>
        </View>
      );
    }
  },
  {
    id: '3',
    title: 'Global Tracking',
    description: 'Track incomes across multiple currencies seamlessly with automated real-time exchange rates.',
    Visual: ({ isActive, hasBeenSeen }: SlideProps) => {
      const { colors } = useTheme();
      return (
        <View style={styles.visualContainer}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: hasBeenSeen ? 1 : 0.8, opacity: hasBeenSeen ? 1 : 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ zIndex: 2 }}
          >
            <MotiView
              from={{ rotate: '0deg', scale: 0.95 }}
              animate={{ rotate: '5deg', scale: 1 }}
              transition={{ type: 'timing', duration: 4000, loop: true, repeatReverse: true }}
              style={[styles.styledCard, { backgroundColor: colors.primary, borderColor: colors.primary, ...SHADOWS.medium }]}
            >
              <Text style={[TYPOGRAPHY.label, { color: 'rgba(255,255,255,0.8)' }]}>USD Income</Text>
              <Text style={[TYPOGRAPHY.h2, { color: '#ffffff' }]}>$2,500</Text>
            </MotiView>
          </MotiView>

          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: hasBeenSeen ? 0 : 20, opacity: hasBeenSeen ? 1 : 0 }}
            transition={{ type: 'spring', damping: 20, delay: 200 }}
            style={{ position: 'absolute', top: '50%', left: 20, zIndex: 1 }}
          >
            <MotiView
              from={{ rotate: '0deg', translateY: 0 }}
              animate={{ rotate: '-8deg', translateY: 30 }}
              transition={{ type: 'timing', duration: 5000, loop: true, repeatReverse: true, delay: 300 }}
              style={[styles.styledCard, {
                backgroundColor: colors.card,
                borderColor: colors.border,
                ...SHADOWS.soft
              }]}
            >
              <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary }]}>Converted to NGN</Text>
              <Text style={[TYPOGRAPHY.h3, { color: colors.income }]}>₦3,750,000</Text>
            </MotiView>
          </MotiView>

          <MotiView
            from={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: hasBeenSeen ? 1 : 0.5, opacity: hasBeenSeen ? 1 : 0 }}
            transition={{ delay: 600, type: 'spring' }}
            style={[styles.connector, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="swap-horizontal" size={24} color={colors.accent} />
          </MotiView>
        </View>
      );
    }
  }
];

export const OnboardingScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [seenSlides, setSeenSlides] = useState<number[]>([0]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
      if (!seenSlides.includes(index)) {
        setSeenSlides(prev => [...prev, index]);
      }
    }
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    } else {
      navigation.navigate('CountrySelector'); // Proceed to country selection
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={isDark ? [colors.mesh1, colors.background] : [colors.mesh2, colors.background]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      <View style={styles.scrollWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {SLIDES.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.visualArea}>
                <slide.Visual isActive={activeIndex === index} hasBeenSeen={seenSlides.includes(index)} />
              </View>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: seenSlides.includes(index) ? 1 : 0, translateY: seenSlides.includes(index) ? 0 : 20 }}
                transition={{ delay: 200 }}
                style={styles.textArea}
              >
                <Text style={[TYPOGRAPHY.h1, { color: colors.text, marginBottom: SIZES.small, textAlign: 'center' }]}>
                  {slide.title}
                </Text>
                <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: SIZES.medium }]}>
                  {slide.description}
                </Text>
              </MotiView>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footerWrapper}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <MotiView
              key={index}
              animate={{
                width: activeIndex === index ? 24 : 8,
                backgroundColor: activeIndex === index ? colors.primary : colors.border
              }}
              style={styles.dot}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={styles.nextButtonWrapper}>
          <LinearGradient
            colors={[colors.primary, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.nextButton, SHADOWS.glow]}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: '#ffffff' }]}>
              {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
    paddingBottom: 20, // space before footer
  },
  slide: {
    width,
    flex: 1,
    paddingTop: height * 0.1,
  },
  visualArea: {
    flex: 2, // takes more space for visuals
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    flex: 1, // takes remaining space for text
    paddingHorizontal: SIZES.large,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: SIZES.large,
  },
  footerWrapper: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.xlarge,
    backgroundColor: 'transparent',
    // Removed absolute positioning, it will naturally sit at the bottom
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.xlarge,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButtonWrapper: {
    width: '100%',
  },
  nextButton: {
    flexDirection: 'row',
    paddingVertical: SIZES.medium,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Visual specific styles
  floatingMiniBadge: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styledCard: {
    padding: SIZES.xlarge,
    borderRadius: 24,
    borderWidth: 1,
    width: width * 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
    marginBottom: SIZES.medium,
  },
  skeletonLine: {
    height: 8,
    borderRadius: 4,
    marginBottom: SIZES.small,
  },
  highlightBadge: {
    position: 'absolute',
    top: 20,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    transform: [{ rotate: '5deg' }],
  },
  connector: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '35%',
    right: 20,
    zIndex: 5,
  }
});
