import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  SectionList,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SIZES, TYPOGRAPHY, FONTS, SHADOWS } from '../theme';
import { useAppContext } from '../context/AppContext';
import { ALL_CURRENCIES, getCurrencyData, CurrencyData } from '../utils/currencyData';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (currencyCode: string) => void;
  selectedCurrency: string;
}

const { height } = Dimensions.get('window');

// Layout constants for SectionList getItemLayout
const ITEM_HEIGHT = 65; // Rigid height
const HEADER_HEIGHT = 36; // Rigid height

// Memoized Item Component to prevent unnecessary re-renders
const CurrencyItem = React.memo(({ item, selectedCurrency, onSelect, colors }: any) => {
  const isSelected = selectedCurrency === item.code;
  
  return (
    <TouchableOpacity
      style={[
        styles.currencyItem,
        { borderBottomColor: colors.border },
        isSelected && { backgroundColor: `${colors.primary}10` }
      ]}
      onPress={() => onSelect(item.code)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: `https://flagcdn.com/w160/${item.flag}.png` }}
        style={styles.flagIcon}
      />
      <View style={styles.currencyInfo}>
        <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text }]}>{item.name}</Text>
        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>{item.code}</Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
});

const AlphabetSidebar = React.memo(({ letters, activeLetter, onLetterPress, colors }: any) => {
  return (
    <View style={styles.alphabetBar}>
      {letters.map((letter: string, index: number) => {
        const isActive = activeLetter === letter;
        return (
          <Pressable 
            key={letter} 
            onPress={() => onLetterPress(index)}
            style={({ pressed }) => [
              styles.letterBtn,
              (pressed || isActive) && { backgroundColor: `${colors.primary}20`, borderRadius: 10 }
            ]}
          >
            {({ pressed }) => (
              <Text style={[
                styles.alphabetText, 
                { 
                  color: (pressed || isActive) ? colors.primary : colors.textSecondary,
                  opacity: (pressed || isActive) ? 1 : 0.6
                }
              ]}>
                {letter}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
});

export const CurrencyModal: React.FC<Props> = ({ visible, onClose, onSelect, selectedCurrency }) => {
  const { colors, isDark } = useTheme();
  const { settings, logCurrencyUsage } = useAppContext();
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filteredCurrencies = useMemo(() => {
    if (!search) return ALL_CURRENCIES;
    const s = search.toLowerCase();
    return ALL_CURRENCIES.filter(c =>
      c.code.toLowerCase().includes(s) ||
      c.name.toLowerCase().includes(s)
    );
  }, [search]);

  const commonlyUsed = useMemo(() => {
    const usage = settings.currencyUsage || {};
    return ALL_CURRENCIES
      .filter(c => usage[c.code] && usage[c.code] > 0)
      .sort((a, b) => usage[b.code] - usage[a.code])
      .slice(0, 5);
  }, [settings.currencyUsage]);

  const commonlyUsedCodes = useMemo(() => commonlyUsed.map(c => c.code), [commonlyUsed]);

  const sections = useMemo(() => {
    if (search) {
      return [{ title: '', data: filteredCurrencies, isCommon: false }];
    }

    const result = [];
    if (commonlyUsed.length > 0) {
      result.push({ title: '★ Commonly Used', data: commonlyUsed, isCommon: true });
    }

    const remaining = filteredCurrencies.filter(c => !commonlyUsedCodes.includes(c.code));
    const grouped = remaining.reduce((acc, curr) => {
      const letter = curr.name.charAt(0).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(curr);
      return acc;
    }, {} as Record<string, typeof remaining>);

    Object.keys(grouped).sort().forEach(letter => {
      result.push({ title: letter, data: grouped[letter], isCommon: false });
    });

    return result;
  }, [search, filteredCurrencies, commonlyUsed, commonlyUsedCodes]);

  const letters = useMemo(() => {
    if (search) return [];
    return sections.filter(s => !s.isCommon).map(s => s.title);
  }, [sections, search]);

  const sectionListRef = useRef<SectionList>(null);

  const scrollToSection = React.useCallback((index: number) => {
    const letter = letters[index];
    setActiveLetter(letter); 
    
    const actualIndex = commonlyUsed.length > 0 ? index + 1 : index;
    sectionListRef.current?.scrollToLocation({
      sectionIndex: actualIndex,
      itemIndex: 0,
      animated: true,
      viewOffset: 24,
    });
  }, [commonlyUsed.length, letters]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 40, // Slightly more aggressive
    minimumViewTime: 10, // Very low to feel snappy
  }).current;

  // Track the current letter so we don't trigger state updates on every scroll tick
  const currentLetterRef = useRef<string | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstSection = viewableItems[0].section;
      const targetLetter = firstSection && !firstSection.isCommon ? firstSection.title : null;
      
      if (currentLetterRef.current !== targetLetter) {
        currentLetterRef.current = targetLetter;
        setActiveLetter(targetLetter);
      }
    }
  }).current;

  const getItemLayout = React.useCallback((data: any, index: number) => {
    let offset = 0;
    let flatIndex = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const currentHeaderHeight = section.title ? HEADER_HEIGHT : 0;
      
      if (flatIndex === index) {
        return { length: currentHeaderHeight, offset, index };
      }
      offset += currentHeaderHeight;
      flatIndex++;

      for (let j = 0; j < section.data.length; j++) {
        if (flatIndex === index) {
          return { length: ITEM_HEIGHT, offset, index };
        }
        offset += ITEM_HEIGHT;
        flatIndex++;
      }
      
      if (flatIndex === index) {
        return { length: 0, offset, index };
      }
      flatIndex++;
    }

    return { length: 0, offset, index };
  }, [sections]);

  const handleSelect = React.useCallback((code: string) => {
    onSelect(code);
    logCurrencyUsage(code);
    onClose();
  }, [onSelect, logCurrencyUsage, onClose]);

  const renderCurrencyItem = React.useCallback(({ item }: { item: any }) => (
    <CurrencyItem 
      item={item} 
      selectedCurrency={selectedCurrency} 
      onSelect={handleSelect}
      colors={colors}
    />
  ), [selectedCurrency, handleSelect, colors]);

  const renderSectionHeader = React.useCallback(({ section: { title, isCommon } }: any) => (
    title ? (
      <View style={{ backgroundColor: colors.background, height: HEADER_HEIGHT, justifyContent: 'center', paddingHorizontal: 4 }}>
        <Text style={[TYPOGRAPHY.label, { color: isCommon ? colors.accent : colors.textSecondary }]}>
          {title}
        </Text>
      </View>
    ) : <View style={{ height: 0 }} />
  ), [colors]);

  const keyExtractor = React.useCallback((item: any) => item.code, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalOverlayInner}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Change Currency</Text>
                <TouchableOpacity onPress={() => { onClose(); setSearch(''); }} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search currency or country"
                  placeholderTextColor={colors.textSecondary}
                  value={search}
                  onChangeText={setSearch}
                  autoCorrect={false}
                />
              </View>

              <SectionList
                ref={sectionListRef}
                sections={sections}
                keyExtractor={keyExtractor}
                renderItem={renderCurrencyItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                getItemLayout={getItemLayout}
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={Platform.OS === 'android'}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
              />
              {!search && letters.length > 0 && (
                <AlphabetSidebar 
                  letters={letters}
                  activeLetter={activeLetter}
                  onLetterPress={scrollToSection}
                  colors={colors}
                />
              )}
            </SafeAreaView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalOverlayInner: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: height * 0.85,
    maxHeight: '100%',
    flexShrink: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...SHADOWS.elevated,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.large,
  },
  closeBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.large,
    paddingHorizontal: SIZES.medium,
    borderRadius: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.small,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  listContent: {
    padding: SIZES.large,
    paddingBottom: 40,
    paddingRight: SIZES.large + 24, // Space for alphabet bar
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT, // Rigid height for getItemLayout
    borderBottomWidth: 1,
    paddingHorizontal: SIZES.small,
    marginHorizontal: -SIZES.small,
    borderRadius: 12,
  },
  flagIcon: {
    width: 44,
    height: 32,
    borderRadius: 6,
    marginRight: SIZES.medium,
  },
  currencyInfo: {
    flex: 1,
  },
  alphabetBar: {
    position: 'absolute',
    right: 8,
    top: 140,
    bottom: SIZES.large,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
  },
  letterBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  alphabetText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
  }
});
