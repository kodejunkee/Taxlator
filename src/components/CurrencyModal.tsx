import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Image,
  SafeAreaView,
  Dimensions
} from 'react-native';
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

export const CurrencyModal: React.FC<Props> = ({ visible, onClose, onSelect, selectedCurrency }) => {
  const { colors, isDark } = useTheme();
  const { settings, logCurrencyUsage } = useAppContext();
  const [search, setSearch] = useState('');

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

  const renderCurrencyItem = ({ item }: { item: any }) => {
    if (item.isHeader) {
      return (
        <Text style={[TYPOGRAPHY.label, { color: colors.textSecondary, marginBottom: SIZES.medium, marginTop: SIZES.xlarge }]}>
          {item.label}
        </Text>
      );
    }

    return (
      <TouchableOpacity 
        style={[
          styles.currencyItem, 
          { borderBottomColor: colors.border },
          selectedCurrency === item.code && { backgroundColor: `${colors.primary}10` }
        ]}
        onPress={() => {
          onSelect(item.code);
          logCurrencyUsage(item.code);
          onClose();
        }}
      >
        <Image 
          source={{ uri: `https://flagcdn.com/w160/${item.flag}.png` }} 
          style={styles.flagIcon} 
        />
        <View style={styles.currencyInfo}>
          <Text style={[TYPOGRAPHY.bodyBold, { color: colors.text }]}>{item.name}</Text>
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>{item.code}</Text>
        </View>
        {selectedCurrency === item.code && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={[TYPOGRAPHY.h3, { color: colors.text }]}>Change Currency</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search currency or country/region"
                placeholderTextColor={colors.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={search ? (filteredCurrencies as any[]) : [
                ...commonlyUsed,
                ...(commonlyUsed.length > 0 ? [{ id: 'header-all', isHeader: true, label: 'All Currencies' }] : []),
                ...filteredCurrencies.filter(c => !commonlyUsedCodes.includes(c.code))
              ] as any[]}
              keyExtractor={(item: any) => item.isHeader ? item.id : item.code}
              renderItem={renderCurrencyItem}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={!search && commonlyUsed.length > 0 ? (
                <Text style={[TYPOGRAPHY.label, { color: colors.accent, marginBottom: SIZES.medium, marginTop: SIZES.small }]}>
                  Commonly Used
                </Text>
              ) : null}
            />
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: height * 0.85,
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
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
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
});
