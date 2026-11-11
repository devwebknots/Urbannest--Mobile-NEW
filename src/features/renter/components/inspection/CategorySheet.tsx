/**
 * CategorySheet: bottom sheet listing the issue categories (the area page's
 * "Category" dropdown). The current choice shows a navy tick. Closes on
 * backdrop tap, Android back, or picking a category.
 */

import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { IssueCategory } from '../../types';
import { TILE_BORDER } from '../checkin/CheckInChecklist';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  visible: boolean;
  categories: readonly IssueCategory[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export const CategorySheet: React.FC<Props> = ({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close categories" />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose a category</Text>
        <ScrollView style={styles.list} bounces={false}>
          {categories.map((c, i) => {
            const on = c.id === selectedId;
            return (
              <Pressable
                key={c.id}
                onPress={() => onSelect(c.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={c.label}
                style={({ pressed }) => [
                  styles.row,
                  i > 0 && styles.rowDivider,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.rowText, on && styles.rowTextOn]}>{c.label}</Text>
                {on ? (
                  <View style={styles.tick}>
                    <RenterIcon name="check" size={ms(10)} color={colors.white} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '75%',
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
    marginBottom: spacing.sm,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ms(52),
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  rowText: {
    ...typographyPresets.body,
    color: colors.textPrimary,
  },
  rowTextOn: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  tick: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default CategorySheet;
