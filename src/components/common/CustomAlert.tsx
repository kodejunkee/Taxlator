import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS, TYPOGRAPHY } from '../../theme';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const { width } = Dimensions.get('window');

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <AnimatePresence>
        {visible && (
          <View style={styles.container}>
            {/* Backdrop */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 150 }}
              style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
              onStartShouldSetResponder={() => true}
              onResponderRelease={onCancel || onConfirm}
            />

            {/* Alert Box */}
            <MotiView
              from={{ scale: 0.97, translateY: 10 }}
              animate={{ scale: 1, translateY: 0 }}
              exit={{ scale: 0.97, translateY: 10 }}
              transition={{ type: 'spring', damping: 20 }}
              style={[
                styles.alertBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                SHADOWS.medium,
              ]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: isDestructive ? `${colors.tax}15` : `${colors.accent}15` }]}>
                <Ionicons
                  name={isDestructive ? 'alert-circle-outline' : 'information-circle-outline'}
                  size={32}
                  color={isDestructive ? colors.tax : colors.accent}
                />
              </View>

              <Text style={[TYPOGRAPHY.h3, { color: colors.text, textAlign: 'center', marginBottom: SIZES.small }]}>
                {title}
              </Text>

              <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: SIZES.large }]}>
                {message}
              </Text>

              <View style={styles.buttonRow}>
                {onCancel && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                    onPress={() => {
                      onCancel();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[TYPOGRAPHY.bodyMedium, { color: colors.textSecondary }]}>{cancelText}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    { backgroundColor: isDestructive ? colors.tax : colors.accent },
                    !onCancel && { marginLeft: 0 }
                  ]}
                  onPress={() => {
                    onConfirm();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[TYPOGRAPHY.bodyBold, { color: '#FFFFFF' }]}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  alertBox: {
    width: width * 0.85,
    borderRadius: SIZES.radius,
    padding: SIZES.large,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: SIZES.small,
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: SIZES.small,
  },
});
