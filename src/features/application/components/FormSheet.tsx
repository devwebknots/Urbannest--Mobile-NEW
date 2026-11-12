/**
 * FormSheet: bottom sheet frame for the rental application's small forms
 * (co-applicant, dependent, pet, vehicle). Same look as `CategorySheet`:
 * white, 28 top corners, handle, `sectionHeading` navy title + `cardSubtitle`
 * line, navy-dimmed backdrop; keyboard-aware. Fields go in `children`; a
 * full-width `brand` save button and an optional red "Remove" link follow.
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  visible: boolean;
  title: string;
  subtitle: string;
  saveLabel: string;
  canSave: boolean;
  onSave: () => void;
  /** Shows a red link under the save button (edit mode) */
  removeLabel?: string;
  onRemove?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export const FormSheet: React.FC<Props> = ({
  visible,
  title,
  subtitle,
  saveLabel,
  canSave,
  onSave,
  removeLabel,
  onRemove,
  onClose,
  children,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView
        style={styles.avoid}
        // padding on both: the modal draws edge to edge on Android too
        behavior="padding"
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <ScrollView bounces={false} keyboardShouldPersistTaps="handled" style={styles.body}>
            <View style={styles.fields}>{children}</View>
          </ScrollView>

          <Button
            title={saveLabel}
            variant="brand"
            onPress={onSave}
            disabled={!canSave}
            style={styles.save}
          />
          {removeLabel && onRemove ? (
            <Button
              title={removeLabel}
              variant="link"
              onPress={onRemove}
              textStyle={styles.remove}
              style={styles.removeButton}
            />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  avoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '85%',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.header,
    borderTopRightRadius: borderRadius.header,
  },
  handle: {
    alignSelf: 'center',
    width: ms(40),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: TILE_BORDER,
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.lg,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  body: {
    flexGrow: 0,
    marginTop: spacing.lg,
  },
  fields: {
    gap: spacing.md,
  },
  save: {
    marginTop: spacing.xl,
  },
  removeButton: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  remove: {
    color: colors.error,
  },
});

export default FormSheet;
